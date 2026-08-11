-- ==============================================================================
-- SUPABASE RPC MIGRATION: book_seat
-- Description: Performs atomic seat reservation using row-level locking (FOR UPDATE).
-- Parameter: event_id_param is TEXT to match the live `events.id` column type (e.g. 'evt-1').
-- ==============================================================================

CREATE OR REPLACE FUNCTION book_seat(event_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_seats INT;
BEGIN
  -- Lock the target event row for update to prevent concurrent race conditions
  SELECT seats_available INTO v_seats
  FROM events
  WHERE id = event_id_param
  FOR UPDATE;

  -- Return FALSE if event is not found or has no remaining seats
  IF v_seats IS NULL OR v_seats <= 0 THEN
    RETURN FALSE;
  END IF;

  -- Atomically decrement available seats
  UPDATE events
  SET seats_available = seats_available - 1
  WHERE id = event_id_param;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
