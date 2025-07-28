import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateSession } from '../middleware/validation';

const router = express.Router();

// Get user's sessions
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { status, type = 'all' } = req.query;

  let query = supabaseAdmin
    .from('sessions')
    .select(`
      id, title, description, duration, price, scheduled_at, status, meeting_link,
      expert:expert_id(id, name, avatar, profession),
      client:client_id(id, name, avatar, profession)
    `);

  // Filter by user (either as expert or client)
  if (type === 'expert') {
    query = query.eq('expert_id', req.user!.id);
  } else if (type === 'client') {
    query = query.eq('client_id', req.user!.id);
  } else {
    query = query.or(`expert_id.eq.${req.user!.id},client_id.eq.${req.user!.id}`);
  }

  // Filter by status
  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('scheduled_at', { ascending: false });

  const { data: sessions, error } = await query;

  if (error) {
    console.error('Sessions fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions'
    });
  }

  res.json({
    success: true,
    data: { sessions }
  });
}));

// Book a session
router.post('/book', 
  authenticateToken,
  validateSession,
  asyncHandler(async (req: AuthRequest, res) => {
    const { expert_id, title, description, duration, price, scheduled_at } = req.body;

    // Check if expert exists
    const { data: expert } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .eq('id', expert_id)
      .single();

    if (!expert) {
      return res.status(404).json({
        success: false,
        error: 'Expert not found'
      });
    }

    // Check if user is trying to book with themselves
    if (expert_id === req.user!.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book session with yourself'
      });
    }

    const sessionId = uuidv4();
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .insert({
        id: sessionId,
        expert_id,
        client_id: req.user!.id,
        title,
        description,
        duration,
        price,
        scheduled_at,
        status: 'pending',
        meeting_link: `https://meet.google.com/${sessionId.substring(0, 8)}`,
        created_at: new Date().toISOString()
      })
      .select(`
        id, title, description, duration, price, scheduled_at, status, meeting_link,
        expert:expert_id(id, name, avatar, profession),
        client:client_id(id, name, avatar, profession)
      `)
      .single();

    if (error) {
      console.error('Session booking error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to book session'
      });
    }

    // TODO: Send notification to expert
    // TODO: If paid session, create payment intent

    res.status(201).json({
      success: true,
      data: { session }
    });
  })
);

// Get session details
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select(`
      id, title, description, duration, price, scheduled_at, status, meeting_link, notes,
      expert:expert_id(id, name, avatar, profession, bio, expertise, rating, review_count),
      client:client_id(id, name, avatar, profession, bio)
    `)
    .eq('id', id)
    .single();

  if (error || !session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  // Check if user is part of this session
  if (session.expert.id !== req.user!.id && session.client.id !== req.user!.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this session'
    });
  }

  res.json({
    success: true,
    data: { session }
  });
}));

// Update session status
router.patch('/:id/status', 
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    // Get session to check permissions
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .select('expert_id, client_id, status as current_status')
      .eq('id', id)
      .single();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Check permissions
    const isExpert = session.expert_id === req.user!.id;
    const isClient = session.client_id === req.user!.id;

    if (!isExpert && !isClient) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this session'
      });
    }

    // Business logic for status changes
    if (status === 'confirmed' && !isExpert) {
      return res.status(403).json({
        success: false,
        error: 'Only expert can confirm sessions'
      });
    }

    const { data: updatedSession, error } = await supabaseAdmin
      .from('sessions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id, title, status, scheduled_at,
        expert:expert_id(id, name),
        client:client_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Session update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update session'
      });
    }

    res.json({
      success: true,
      data: { session: updatedSession }
    });
  })
);

// Add session notes
router.patch('/:id/notes', 
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    // Get session to check permissions
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .select('expert_id, client_id')
      .eq('id', id)
      .single();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Check if user is part of this session
    if (session.expert_id !== req.user!.id && session.client_id !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this session'
      });
    }

    const { error } = await supabaseAdmin
      .from('sessions')
      .update({ 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Session notes update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update session notes'
      });
    }

    res.json({
      success: true,
      message: 'Session notes updated successfully'
    });
  })
);

// Get available time slots for an expert
router.get('/experts/:expertId/slots', asyncHandler(async (req, res) => {
  const { expertId } = req.params;
  const { date } = req.query;

  // This is a simplified version - in a real app, you'd have a more complex availability system
  const mockSlots = [
    { id: uuidv4(), time: '09:00', available: true, price: 0 },
    { id: uuidv4(), time: '10:00', available: true, price: 75 },
    { id: uuidv4(), time: '11:00', available: false, price: 75 },
    { id: uuidv4(), time: '14:00', available: true, price: 50 },
    { id: uuidv4(), time: '15:00', available: true, price: 50 },
    { id: uuidv4(), time: '16:00', available: true, price: 0 }
  ];

  res.json({
    success: true,
    data: { slots: mockSlots }
  });
}));

export { router as sessionRoutes };