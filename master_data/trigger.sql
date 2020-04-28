CREATE TRIGGER after_event_insert
    AFTER INSERT ON events
    FOR EACH ROW 
    UPDATE categories SET event_count=(select count(*) FROM events where category_id = NEW.category_id AND status='published') where id = NEW.category_id;

 CREATE TRIGGER after_event_update
    AFTER UPDATE ON events
    FOR EACH ROW 
    UPDATE categories SET event_count=(select count(*) FROM events where category_id = NEW.category_id AND status='published') where id = NEW.category_id;   

    - waiting for approval
    - published
    - decline
    - waiting for reapproval
    - deleted
    - expired