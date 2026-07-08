-- =====================================================
-- LINKUP V6 - ROW LEVEL SECURITY POLICIES
-- =====================================================

-- =====================================================
-- PROFILES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Anyone can view public profile fields (for discovery)
CREATE POLICY "Anyone can view public profiles"
    ON profiles FOR SELECT
    USING (
        deleted_at IS NULL AND
        (
            -- Own profile
            auth.uid() = id OR
            -- Public profiles are visible
            trust_score > 20
        )
    );

-- =====================================================
-- EVENTS
-- =====================================================

-- Anyone can view published events
CREATE POLICY "Anyone can view published events"
    ON events FOR SELECT
    USING (
        deleted_at IS NULL AND
        status IN ('published', 'ongoing', 'completed')
    );

-- Users can create events
CREATE POLICY "Users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

-- Users can update their own events
CREATE POLICY "Users can update own events"
    ON events FOR UPDATE
    USING (auth.uid() = organizer_id);

-- Admins can update any event
CREATE POLICY "Admins can update any event"
    ON events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin', 'moderator')
        )
    );

-- Users can soft delete their own events
CREATE POLICY "Users can delete own events"
    ON events FOR DELETE
    USING (auth.uid() = organizer_id);

-- Admins can delete any event
CREATE POLICY "Admins can delete any event"
    ON events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin', 'moderator')
        )
    );

-- =====================================================
-- EVENT PARTICIPANTS
-- =====================================================

-- Users can view participants of events they're part of
CREATE POLICY "Users can view event participants"
    ON event_participants FOR SELECT
    USING (
        user_id = auth.uid() OR
        event_id IN (
            SELECT id FROM events
            WHERE organizer_id = auth.uid()
            OR id IN (
                SELECT event_id FROM event_participants
                WHERE user_id = auth.uid()
            )
        )
    );

-- Users can join events
CREATE POLICY "Users can join events"
    ON event_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own participation
CREATE POLICY "Users can update own participation"
    ON event_participants FOR UPDATE
    USING (auth.uid() = user_id);

-- Event organizers can manage participants
CREATE POLICY "Organizers can manage participants"
    ON event_participants FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

-- =====================================================
-- EVENT REQUESTS
-- =====================================================

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
    ON event_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create requests
CREATE POLICY "Users can create requests"
    ON event_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Organizers can view requests for their events
CREATE POLICY "Organizers can view requests"
    ON event_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

-- Organizers can update requests
CREATE POLICY "Organizers can update requests"
    ON event_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM events e
            WHERE e.id = event_id AND e.organizer_id = auth.uid()
        )
    );

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- System can insert notifications (via service role)
-- No INSERT policy for users - notifications are created by the system

-- =====================================================
-- CHATS & MESSAGES
-- =====================================================

-- Chat members can view their chats
CREATE POLICY "Members can view chats"
    ON chats FOR SELECT
    USING (
        id IN (SELECT chat_id FROM chat_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Members can create chats
CREATE POLICY "Members can create chats"
    ON chats FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM chat_members WHERE chat_id = id
        )
    );

-- Members can update chats they own
CREATE POLICY "Members can update chats"
    ON chats FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM chat_members
            WHERE chat_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Members can view messages in their chats
CREATE POLICY "Members can view messages"
    ON messages FOR SELECT
    USING (
        chat_id IN (
            SELECT chat_id FROM chat_members
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Members can send messages
CREATE POLICY "Members can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        chat_id IN (
            SELECT chat_id FROM chat_members
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Members can update their own messages
CREATE POLICY "Members can update own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Chat admins can delete any message
CREATE POLICY "Admins can delete messages"
    ON messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM chat_members
            WHERE chat_id = messages.chat_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
        OR auth.uid() = sender_id
    );

-- =====================================================
-- BUSINESS PROFILES
-- =====================================================

-- Anyone can view verified businesses
CREATE POLICY "Anyone can view verified businesses"
    ON business_profiles FOR SELECT
    USING (is_verified = TRUE OR profile_id = auth.uid());

-- Users can create their business profile
CREATE POLICY "Users can create business profile"
    ON business_profiles FOR INSERT
    WITH CHECK (profile_id = auth.uid());

-- Business owners can update their profile
CREATE POLICY "Business owners can update profile"
    ON business_profiles FOR UPDATE
    USING (profile_id = auth.uid());

-- Admins can verify businesses
CREATE POLICY "Admins can verify businesses"
    ON business_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin', 'moderator')
        )
    );

-- =====================================================
-- ORGANIZER PROFILES
-- =====================================================

-- Anyone can view organizer profiles
CREATE POLICY "Anyone can view organizer profiles"
    ON organizer_profiles FOR SELECT
    USING (profile_id = auth.uid() OR rank != 'newcomer');

-- Users can view their own organizer profile
CREATE POLICY "Users can view own organizer profile"
    ON organizer_profiles FOR SELECT
    USING (profile_id = auth.uid());

-- Users can create organizer profile
CREATE POLICY "Users can create organizer profile"
    ON organizer_profiles FOR INSERT
    WITH CHECK (profile_id = auth.uid());

-- Users can update their own organizer profile
CREATE POLICY "Users can update own organizer profile"
    ON organizer_profiles FOR UPDATE
    USING (profile_id = auth.uid());

-- =====================================================
-- FAVORITES
-- =====================================================

-- Users can only view their own favorites
CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can remove their favorites
CREATE POLICY "Users can remove favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- BLOCKS & MUTES
-- =====================================================

-- Users can only see their own blocks/mutes
CREATE POLICY "Users can view own blocks"
    ON blocks FOR SELECT
    USING (auth.uid() = blocker_id);

CREATE POLICY "Users can manage own blocks"
    ON blocks FOR ALL
    USING (auth.uid() = blocker_id);

CREATE POLICY "Users can view own mutes"
    ON mutes FOR SELECT
    USING (auth.uid() = muter_id);

CREATE POLICY "Users can manage own mutes"
    ON mutes FOR ALL
    USING (auth.uid() = muter_id);

-- =====================================================
-- USER INTERESTS
-- =====================================================

-- Users can view their own interests
CREATE POLICY "Users can view own interests"
    ON user_interests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own interests
CREATE POLICY "Users can manage own interests"
    ON user_interests FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

-- Anyone can view achievements
CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    USING (is_active = TRUE);

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own achievements (progress)
CREATE POLICY "Users can update own achievements"
    ON user_achievements FOR UPDATE
    USING (auth.uid() = user_id);

-- Anyone can view badges
CREATE POLICY "Anyone can view badges"
    ON badges FOR SELECT
    USING (is_active = TRUE);

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT
    USING (auth.uid() = user_id);

-- Users can equip/unequip their own badges
CREATE POLICY "Users can manage own badges"
    ON user_badges FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- XP & REPUTATION HISTORY
-- =====================================================

-- Users can view their own XP history
CREATE POLICY "Users can view own XP history"
    ON xp_history FOR SELECT
    USING (auth.uid() = user_id);

-- Users can view their own reputation history
CREATE POLICY "Users can view own reputation history"
    ON reputation_history FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- SAVED PLACES
-- =====================================================

-- Users can only view their own saved places
CREATE POLICY "Users can view own saved places"
    ON saved_places FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own saved places
CREATE POLICY "Users can manage own saved places"
    ON saved_places FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- REPORTS (Moderation)
-- =====================================================

-- Users can create reports
CREATE POLICY "Users can create reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
    ON reports FOR SELECT
    USING (auth.uid() = reporter_id);

-- Moderators can view all pending reports
CREATE POLICY "Moderators can view reports"
    ON reports FOR SELECT
    USING (
        reporter_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('moderator', 'admin', 'super_admin')
        )
    );

-- Moderators can update reports
CREATE POLICY "Moderators can update reports"
    ON reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('moderator', 'admin', 'super_admin')
        )
    );

-- =====================================================
-- DEVICES & SESSIONS
-- =====================================================

-- Users can view their own devices
CREATE POLICY "Users can view own devices"
    ON devices FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own devices
CREATE POLICY "Users can manage own devices"
    ON devices FOR ALL
    USING (auth.uid() = user_id);

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
    ON sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own sessions
CREATE POLICY "Users can manage own sessions"
    ON sessions FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- ANALYTICS (Service role only for writes)
-- =====================================================

-- Anyone can read analytics
CREATE POLICY "Anyone can read analytics"
    ON analytics_events FOR SELECT
    USING (TRUE);

-- System can write analytics (handled via service role)
-- No user INSERT/UPDATE policies needed

-- =====================================================
-- USER ROLES (Admin only)
-- =====================================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can manage roles"
    ON user_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- PREMIUM
-- =====================================================

-- Users can view their own premium status
CREATE POLICY "Users can view own premium"
    ON premium FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- SYSTEM SETTINGS (Read only for users)
-- =====================================================

-- Anyone can view public settings
CREATE POLICY "Anyone can view public settings"
    ON system_settings FOR SELECT
    USING (is_public = TRUE);

-- Only service role can modify settings
-- No user INSERT/UPDATE policies
