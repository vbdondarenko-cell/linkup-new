-- =====================================================
-- LINKUP V6 - RPC FUNCTIONS
-- =====================================================

-- =====================================================
-- DISCOVERY & EVENTS
-- =====================================================

-- Get discovery feed for user
CREATE OR REPLACE FUNCTION get_discovery_feed(
    p_user_id UUID,
    p_radius INTEGER DEFAULT 10,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    cover_image_url TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION,
    category_name TEXT,
    category_icon TEXT,
    organizer_name TEXT,
    organizer_trust_score DECIMAL,
    current_participants INTEGER,
    max_participants INTEGER,
    is_free BOOLEAN,
    price DECIMAL,
    average_rating DECIMAL,
    is_featured BOOLEAN,
    is_trending BOOLEAN,
    score DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    WITH 
        user_location AS (
            SELECT latitude, longitude, location
            FROM profiles
            WHERE id = p_user_id
        ),
        user_interests AS (
            SELECT interest_id
            FROM user_interests
            WHERE user_id = p_user_id
        ),
        scored_events AS (
            SELECT 
                e.id,
                e.title,
                e.description,
                e.cover_image_url,
                e.start_date,
                e.end_date,
                e.latitude,
                e.longitude,
                ST_Distance(
                    ST_MakePoint(e.longitude, e.latitude)::geography,
                    (SELECT location FROM user_location)
                ) AS distance_meters,
                ec.name AS category_name,
                ec.icon AS category_icon,
                p.display_name AS organizer_name,
                p.trust_score AS organizer_trust_score,
                e.current_participants,
                e.max_participants,
                e.is_free,
                e.price,
                e.average_rating,
                e.is_featured,
                e.is_trending,
                -- Recommendation score calculation
                (
                    -- Distance score (closer = higher)
                    GREATEST(0, 1 - LEAST(1, ST_Distance(
                        ST_MakePoint(e.longitude, e.latitude)::geography,
                        (SELECT location FROM user_location)
                    ) / (p_radius * 1000))
                ) * 0.25 +
                (
                    -- Trust score
                    COALESCE(p.trust_score, 50) / 100.0
                ) * 0.20 +
                (
                    -- Featured/Trending boost
                    CASE WHEN e.is_featured THEN 0.15 ELSE 0 END +
                    CASE WHEN e.is_trending THEN 0.10 ELSE 0 END
                ) +
                (
                    -- Rating score
                    COALESCE(e.average_rating, 0) / 5.0
                ) * 0.15 +
                (
                    -- Interest match
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM user_interests ui
                            JOIN interests i ON ui.interest_id = i.id
                            WHERE i.category_id = e.category_id
                        ) THEN 0.10
                        ELSE 0
                    END
                ) +
                (
                    -- Availability
                    CASE WHEN e.max_participants IS NULL OR e.current_participants < e.max_participants THEN 0.05 ELSE 0 END
                ) AS score
            FROM events e
            JOIN profiles p ON e.organizer_id = p.id
            LEFT JOIN event_categories ec ON e.category_id = ec.id
            WHERE 
                e.status IN ('published', 'ongoing')
                AND e.deleted_at IS NULL
                AND e.start_date > NOW()
                AND (
                    e.location IS NULL OR
                    ST_DWithin(
                        e.location,
                        (SELECT location FROM user_location),
                        p_radius * 1000  -- Convert km to meters
                    )
                )
                -- Exclude blocked users' events
                AND e.organizer_id NOT IN (
                    SELECT blocked_id FROM blocks WHERE blocker_id = p_user_id
                )
                -- Exclude muted users' events
                AND e.organizer_id NOT IN (
                    SELECT muted_id FROM mutes WHERE muter_id = p_user_id
                )
        )
    SELECT
        se.id,
        se.title,
        se.description,
        se.cover_image_url,
        se.start_date,
        se.end_date,
        se.latitude,
        se.longitude,
        se.distance_meters,
        se.category_name,
        se.category_icon,
        se.organizer_name,
        se.organizer_trust_score,
        se.current_participants,
        se.max_participants,
        se.is_free,
        se.price,
        se.average_rating,
        se.is_featured,
        se.is_trending,
        se.score
    FROM scored_events se
    ORDER BY se.score DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get events nearby
CREATE OR REPLACE FUNCTION get_events_nearby(
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_radius_km DOUBLE PRECISION DEFAULT 5,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    cover_image_url TEXT,
    start_date TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION,
    category_name TEXT,
    organizer_name TEXT,
    current_participants INTEGER,
    max_participants INTEGER,
    is_free BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.cover_image_url,
        e.start_date,
        e.latitude,
        e.longitude,
        ST_Distance(
            ST_MakePoint(e.longitude, e.latitude)::geography,
            ST_MakePoint(p_longitude, p_latitude)::geography
        ) AS distance_meters,
        ec.name AS category_name,
        p.display_name AS organizer_name,
        e.current_participants,
        e.max_participants,
        e.is_free
    FROM events e
    JOIN profiles p ON e.organizer_id = p.id
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE 
        e.status IN ('published', 'ongoing')
        AND e.deleted_at IS NULL
        AND e.start_date > NOW()
        AND ST_DWithin(
            ST_MakePoint(e.longitude, e.latitude)::geography,
            ST_MakePoint(p_longitude, p_latitude)::geography,
            p_radius_km * 1000
        )
    ORDER BY distance_meters ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get event details with full info
CREATE OR REPLACE FUNCTION get_event_details(p_event_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    cover_image_url TEXT,
    category_id UUID,
    category_name TEXT,
    category_icon TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location_name TEXT,
    location_address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    max_participants INTEGER,
    current_participants INTEGER,
    price DECIMAL,
    is_free BOOLEAN,
    status VARCHAR(20),
    is_featured BOOLEAN,
    is_trending BOOLEAN,
    average_rating DECIMAL,
    rating_count INTEGER,
    view_count INTEGER,
    organizer_id UUID,
    organizer_name TEXT,
    organizer_avatar_url TEXT,
    organizer_trust_score DECIMAL,
    is_organizer_verified BOOLEAN,
    business_id UUID,
    business_name TEXT,
    business_logo_url TEXT,
    is_business_verified BOOLEAN,
    user_is_participant BOOLEAN,
    user_request_status VARCHAR(20),
    user_can_join BOOLEAN,
    user_can_request BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.cover_image_url,
        e.category_id,
        ec.name AS category_name,
        ec.icon AS category_icon,
        e.start_date,
        e.end_date,
        e.location_name,
        e.location_address,
        e.latitude,
        e.longitude,
        e.max_participants,
        e.current_participants,
        e.price,
        e.is_free,
        e.status::VARCHAR(20),
        e.is_featured,
        e.is_trending,
        e.average_rating,
        e.rating_count,
        e.view_count,
        e.organizer_id,
        p.display_name AS organizer_name,
        p.avatar_url AS organizer_avatar_url,
        p.trust_score AS organizer_trust_score,
        op.is_verified AS is_organizer_verified,
        bp.id AS business_id,
        bp.business_name AS business_name,
        bp.logo_url AS business_logo_url,
        bp.is_verified AS is_business_verified,
        EXISTS (
            SELECT 1 FROM event_participants ep
            WHERE ep.event_id = e.id AND ep.user_id = auth.uid() AND ep.status = 'accepted'
        ) AS user_is_participant,
        COALESCE(
            (SELECT status FROM event_requests WHERE event_id = e.id AND user_id = auth.uid()),
            NULL
        )::VARCHAR(20) AS user_request_status,
        NOT e.is_full AND e.status = 'published' AS user_can_join,
        e.requires_approval AND NOT e.is_full AND e.status = 'published' AS user_can_request
    FROM events e
    JOIN profiles p ON e.organizer_id = p.id
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    LEFT JOIN organizer_profiles op ON op.profile_id = p.id
    LEFT JOIN business_profiles bp ON bp.id = e.business_id
    WHERE e.id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- EVENT ACTIONS
-- =====================================================

-- Join event
CREATE OR REPLACE FUNCTION join_event(p_event_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_event events;
    v_can_join BOOLEAN;
    v_requires_approval BOOLEAN;
    v_result JSONB;
BEGIN
    -- Get event
    SELECT * INTO v_event FROM events WHERE id = p_event_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event not found');
    END IF;
    
    -- Check if already joined
    IF EXISTS (
        SELECT 1 FROM event_participants 
        WHERE event_id = p_event_id AND user_id = auth.uid() AND status = 'accepted'
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already joined');
    END IF;
    
    -- Check if event is full
    IF v_event.is_full THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is full');
    END IF;
    
    -- Check if event is active
    IF v_event.status NOT IN ('published', 'ongoing') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is not accepting participants');
    END IF;
    
    v_requires_approval := v_event.requires_approval;
    
    IF v_requires_approval THEN
        -- Create request
        INSERT INTO event_requests (event_id, user_id, status)
        VALUES (p_event_id, auth.uid(), 'pending');
        
        -- Create notification for organizer
        INSERT INTO notifications (user_id, type, title, body, deep_link, data)
        VALUES (
            v_event.organizer_id,
            'join_request',
            'New Join Request',
            format('Someone wants to join %s', v_event.title),
            '/events/' || p_event_id,
            jsonb_build_object('event_id', p_event_id, 'user_id', auth.uid())
        );
        
        RETURN jsonb_build_object(
            'success', true,
            'action', 'request_pending',
            'message', 'Your request has been sent to the organizer'
        );
    ELSE
        -- Direct join
        INSERT INTO event_participants (event_id, user_id, status)
        VALUES (p_event_id, auth.uid(), 'accepted');
        
        -- Update event participant count
        UPDATE events SET current_participants = current_participants + 1 WHERE id = p_event_id;
        
        -- Create notification
        INSERT INTO notifications (user_id, type, title, body, deep_link, data)
        VALUES (
            auth.uid(),
            'request_accepted',
            'You joined an event!',
            format('You are now attending %s', v_event.title),
            '/events/' || p_event_id,
            jsonb_build_object('event_id', p_event_id)
        );
        
        -- Award XP
        PERFORM award_xp(auth.uid(), 10, 'join_event', p_event_id);
        
        RETURN jsonb_build_object(
            'success', true,
            'action', 'joined',
            'message', 'You have joined the event!'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Leave event
CREATE OR REPLACE FUNCTION leave_event(p_event_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_participant event_participants;
    v_event events;
BEGIN
    -- Get participant record
    SELECT * INTO v_participant 
    FROM event_participants 
    WHERE event_id = p_event_id AND user_id = auth.uid() AND status = 'accepted';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a participant');
    END IF;
    
    -- Get event
    SELECT * INTO v_event FROM events WHERE id = p_event_id;
    
    -- Cannot leave ongoing events
    IF v_event.status = 'ongoing' AND v_participant.was_present THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot leave during event');
    END IF;
    
    -- Remove participant
    DELETE FROM event_participants 
    WHERE event_id = p_event_id AND user_id = auth.uid();
    
    -- Update event participant count
    UPDATE events SET current_participants = GREATEST(0, current_participants - 1) 
    WHERE id = p_event_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Left event successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accept request
CREATE OR REPLACE FUNCTION accept_request(p_request_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_request event_requests;
    v_event events;
BEGIN
    -- Get request
    SELECT * INTO v_request FROM event_requests WHERE id = p_request_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request not found');
    END IF;
    
    -- Get event
    SELECT * INTO v_event FROM events WHERE id = v_request.event_id;
    
    -- Verify organizer
    IF v_event.organizer_id != auth.uid() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
    END IF;
    
    -- Check capacity
    IF v_event.is_full THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is full');
    END IF;
    
    -- Update request
    UPDATE event_requests SET status = 'accepted', responded_at = NOW(), responded_by = auth.uid()
    WHERE id = p_request_id;
    
    -- Create participant
    INSERT INTO event_participants (event_id, user_id, status)
    VALUES (v_request.event_id, v_request.user_id, 'accepted');
    
    -- Update event count
    UPDATE events SET current_participants = current_participants + 1 WHERE id = v_request.event_id;
    
    -- Notify user
    INSERT INTO notifications (user_id, type, title, body, deep_link, data)
    VALUES (
        v_request.user_id,
        'request_accepted',
        'Request Accepted!',
        format('Your request to join %s has been accepted', v_event.title),
        '/events/' || v_request.event_id,
        jsonb_build_object('event_id', v_request.event_id)
    );
    
    -- Award XP
    PERFORM award_xp(v_request.user_id, 10, 'join_event', v_request.event_id);
    
    RETURN jsonb_build_object('success', true, 'message', 'Request accepted');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decline request
CREATE OR REPLACE FUNCTION decline_request(p_request_id UUID, p_message TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
    v_request event_requests;
    v_event events;
BEGIN
    SELECT * INTO v_request FROM event_requests WHERE id = p_request_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request not found');
    END IF;
    
    SELECT * INTO v_event FROM events WHERE id = v_request.event_id;
    
    IF v_event.organizer_id != auth.uid() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
    END IF;
    
    UPDATE event_requests 
    SET status = 'declined', responded_at = NOW(), responded_by = auth.uid(), response_message = p_message
    WHERE id = p_request_id;
    
    -- Notify user
    INSERT INTO notifications (user_id, type, title, body, deep_link, data)
    VALUES (
        v_request.user_id,
        'request_declined',
        'Request Declined',
        format('Your request to join %s was not accepted', v_event.title),
        '/events/' || v_request.event_id,
        jsonb_build_object('event_id', v_request.event_id, 'message', p_message)
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Request declined');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- XP & ACHIEVEMENTS
-- =====================================================

-- Award XP
CREATE OR REPLACE FUNCTION award_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason VARCHAR(255),
    p_source_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_current_level INTEGER;
    v_new_total INTEGER;
BEGIN
    -- Add to XP history
    INSERT INTO xp_history (user_id, amount, reason, source_id)
    VALUES (p_user_id, p_amount, p_reason, p_source_id);
    
    -- Update profile XP
    UPDATE profiles
    SET 
        xp_total = xp_total + p_amount,
        xp_current = xp_current + p_amount
    WHERE id = p_user_id;
    
    -- Check for level up
    SELECT level INTO v_current_level FROM profiles WHERE id = p_user_id;
    
    -- Level thresholds: 0, 100, 300, 750, 1500, 3000
    WHILE v_current_level < 6 AND (
        SELECT xp_total FROM profiles WHERE id = p_user_id
    ) >= CASE v_current_level
        WHEN 1 THEN 100
        WHEN 2 THEN 300
        WHEN 3 THEN 750
        WHEN 4 THEN 1500
        WHEN 5 THEN 3000
        ELSE 999999
    END LOOP
        UPDATE profiles SET level = level + 1 WHERE id = p_user_id;
        v_current_level := v_current_level + 1;
        
        -- Notify level up
        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
            p_user_id,
            'level_up',
            'Level Up!',
            format('You reached level %s!', v_current_level),
            jsonb_build_object('new_level', v_current_level)
        );
    END LOOP;
    
    -- Reset current XP if level changed
    SELECT xp_total INTO v_new_total FROM profiles WHERE id = p_user_id;
    UPDATE profiles 
    SET xp_current = CASE 
        WHEN level >= 6 THEN 0
        ELSE v_new_total - (
            SELECT SUM(xp_total) - SUM(xp_current) 
            FROM profiles 
            WHERE id = p_user_id
            GROUP BY id
        )
    END
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_unlocked JSONB := '[]'::JSONB;
    v_achievement RECORD;
    v_progress INTEGER;
    v_meets_requirement BOOLEAN;
BEGIN
    FOR v_achievement IN 
        SELECT a.*, 
               COALESCE(ua.progress, 0) as current_progress,
               ua.is_completed
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = p_user_id
        WHERE a.is_active = TRUE
        AND (ua.is_completed IS NULL OR ua.is_completed = FALSE)
    LOOP
        v_meets_requirement := FALSE;
        v_progress := 0;
        
        CASE v_achievement.requirement_type
            WHEN 'events_joined' THEN
                SELECT COUNT(*) INTO v_progress
                FROM event_participants
                WHERE user_id = p_user_id AND status = 'accepted' AND was_present = TRUE;
                v_meets_requirement := v_progress >= v_achievement.requirement_value;
                
            WHEN 'events_hosted' THEN
                SELECT COUNT(*) INTO v_progress
                FROM events
                WHERE organizer_id = p_user_id AND status = 'completed';
                v_meets_requirement := v_progress >= v_achievement.requirement_value;
                
            WHEN 'streak' THEN
                SELECT current_streak INTO v_progress
                FROM organizer_profiles
                WHERE profile_id = p_user_id;
                v_meets_requirement := COALESCE(v_progress, 0) >= v_achievement.requirement_value;
                
            WHEN 'rating' THEN
                SELECT COUNT(*) INTO v_progress
                FROM event_participants
                WHERE user_id = p_user_id AND rating = 5;
                v_meets_requirement := v_progress >= v_achievement.requirement_value;
        END CASE;
        
        -- Update progress
        UPDATE user_achievements
        SET progress = v_progress
        WHERE user_id = p_user_id AND achievement_id = v_achievement.id;
        
        IF NOT FOUND THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress)
            VALUES (p_user_id, v_achievement.id, v_progress);
        END IF;
        
        -- Check if completed
        IF v_meets_requirement AND NOT v_achievement.is_completed THEN
            UPDATE user_achievements
            SET is_completed = TRUE, completed_at = NOW()
            WHERE user_id = p_user_id AND achievement_id = v_achievement.id;
            
            -- Award XP
            PERFORM award_xp(p_user_id, v_achievement.xp_reward, 'achievement', v_achievement.id);
            
            -- Notify
            INSERT INTO notifications (user_id, type, title, body, data)
            VALUES (
                p_user_id,
                'achievement_earned',
                'Achievement Unlocked!',
                v_achievement.name,
                jsonb_build_object('achievement_id', v_achievement.id, 'achievement_name', v_achievement.name)
            );
            
            v_unlocked := v_unlocked || jsonb_build_object(
                'id', v_achievement.id,
                'name', v_achievement.name,
                'icon', v_achievement.icon
            );
        END IF;
    END LOOP;
    
    RETURN v_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRUST & REPUTATION
-- =====================================================

-- Update user reputation
CREATE OR REPLACE FUNCTION update_reputation(
    p_user_id UUID,
    p_change DECIMAL,
    p_reason VARCHAR(255),
    p_source VARCHAR(50),
    p_source_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_new_score DECIMAL;
BEGIN
    -- Update reputation
    UPDATE profiles
    SET trust_score = GREATEST(0, LEAST(100, trust_score + p_change))
    WHERE id = p_user_id
    RETURNING trust_score INTO v_new_score;
    
    -- Log history
    INSERT INTO reputation_history (user_id, score_change, new_score, reason, source, source_id)
    VALUES (p_user_id, p_change, v_new_score, p_reason, p_source, p_source_id);
    
    -- Check for trust milestone notification
    IF v_new_score >= 80 AND p_change > 0 THEN
        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
            p_user_id,
            'trust_increased',
            'Trust Score Increased',
            format('Your trust score is now %.0f', v_new_score),
            jsonb_build_object('new_score', v_new_score)
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEARCH
-- =====================================================

-- Universal search
CREATE OR REPLACE FUNCTION search_everything(
    p_query VARCHAR(255),
    p_user_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    result_type VARCHAR(50),
    result_id UUID,
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    -- Search events
    SELECT 
        'event'::VARCHAR(50),
        e.id,
        e.title,
        COALESCE(
            ec.name || ' • ' || 
            EXTRACT(DAY FROM (e.start_date - NOW()))::TEXT || ' days away',
            ''
        ) AS subtitle,
        e.cover_image_url,
        ts_rank(
            to_tsvector('english', e.title || ' ' || COALESCE(e.description, '')),
            plainto_tsquery('english', p_query)
        ) AS relevance_score
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE 
        e.status IN ('published', 'ongoing')
        AND e.deleted_at IS NULL
        AND (
            to_tsvector('english', e.title || ' ' || COALESCE(e.description, '')) @@ plainto_tsquery('english', p_query)
            OR e.title ILIKE '%' || p_query || '%'
        )
    ORDER BY relevance_score DESC
    LIMIT p_limit / 2
    
    UNION ALL
    
    -- Search businesses
    SELECT 
        'business'::VARCHAR(50),
        bp.id,
        bp.business_name,
        COALESCE(bp.city, 'Business'),
        bp.logo_url,
        ts_rank(
            to_tsvector('english', bp.business_name || ' ' || COALESCE(bp.business_email, '')),
            plainto_tsquery('english', p_query)
        ) AS relevance_score
    FROM business_profiles bp
    WHERE 
        bp.is_verified = TRUE
        AND bp.deleted_at IS NULL
        AND (
            to_tsvector('english', bp.business_name) @@ plainto_tsquery('english', p_query)
            OR bp.business_name ILIKE '%' || p_query || '%'
        )
    ORDER BY relevance_score DESC
    LIMIT p_limit / 4
    
    UNION ALL
    
    -- Search profiles
    SELECT 
        'organizer'::VARCHAR(50),
        p.id,
        p.display_name,
        '@' || COALESCE(p.telegram_username, p.id::TEXT),
        p.avatar_url,
        ts_rank(
            to_tsvector('english', p.display_name || ' ' || COALESCE(p.bio, '')),
            plainto_tsquery('english', p_query)
        ) AS relevance_score
    FROM profiles p
    JOIN organizer_profiles op ON op.profile_id = p.id
    WHERE 
        p.deleted_at IS NULL
        AND op.rank != 'newcomer'
        AND (
            to_tsvector('english', p.display_name) @@ plainto_tsquery('english', p_query)
            OR p.display_name ILIKE '%' || p_query || '%'
        )
    ORDER BY relevance_score DESC
    LIMIT p_limit / 4;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REPORTS
-- =====================================================

-- Submit report
CREATE OR REPLACE FUNCTION submit_report(
    p_reason VARCHAR(50),
    p_description TEXT,
    p_reported_user_id UUID DEFAULT NULL,
    p_reported_event_id UUID DEFAULT NULL,
    p_reported_business_id UUID DEFAULT NULL,
    p_evidence_urls TEXT[] DEFAULT NULL
)
RETURNS JSONB AS $$
BEGIN
    -- Create report
    INSERT INTO reports (
        reporter_id, reason, description,
        reported_user_id, reported_event_id, reported_business_id,
        evidence_urls
    ) VALUES (
        auth.uid(), p_reason, p_description,
        p_reported_user_id, p_reported_event_id, p_reported_business_id,
        p_evidence_urls
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Report submitted successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Get user's unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM notifications 
        WHERE user_id = p_user_id 
        AND is_read = FALSE 
        AND is_archived = FALSE
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET is_read = TRUE, read_at = NOW()
    WHERE user_id = p_user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'events_attended',
        (SELECT COUNT(*) FROM event_participants WHERE user_id = p_user_id AND was_present = TRUE),
        'events_hosted',
        (SELECT COUNT(*) FROM events WHERE organizer_id = p_user_id AND status = 'completed'),
        'total_xp',
        (SELECT xp_total FROM profiles WHERE id = p_user_id),
        'current_level',
        (SELECT level FROM profiles WHERE id = p_user_id),
        'trust_score',
        (SELECT trust_score FROM profiles WHERE id = p_user_id),
        'achievements_unlocked',
        (SELECT COUNT(*) FROM user_achievements WHERE user_id = p_user_id AND is_completed = TRUE),
        'badges_earned',
        (SELECT COUNT(*) FROM user_badges WHERE user_id = p_user_id),
        'current_streak',
        (SELECT current_streak FROM organizer_profiles WHERE profile_id = p_user_id),
        'longest_streak',
        (SELECT longest_streak FROM organizer_profiles WHERE profile_id = p_user_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GEOGRAPHY FUNCTIONS
-- =====================================================

-- Calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
    p_lat1 DOUBLE PRECISION,
    p_lon1 DOUBLE PRECISION,
    p_lat2 DOUBLE PRECISION,
    p_lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN ST_Distance(
        ST_MakePoint(p_lon1, p_lat1)::geography,
        ST_MakePoint(p_lon2, p_lat2)::geography
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get events within bounding box
CREATE OR REPLACE FUNCTION get_events_in_bounds(
    p_min_lat DOUBLE PRECISION,
    p_min_lon DOUBLE PRECISION,
    p_max_lat DOUBLE PRECISION,
    p_max_lon DOUBLE PRECISION,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.latitude,
        e.longitude
    FROM events e
    WHERE 
        e.status IN ('published', 'ongoing')
        AND e.deleted_at IS NULL
        AND e.latitude BETWEEN p_min_lat AND p_max_lat
        AND e.longitude BETWEEN p_min_lon AND p_max_lon
    ORDER BY e.start_date ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
