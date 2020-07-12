

DROP PROCEDURE ticket_avaibiltiy;


DELIMITER $$

CREATE PROCEDURE ticket_avaibiltiy(
	IN ticket_id int(10),
	IN input_quantity int(10),
	OUT status boolean
)
BEGIN
	DECLARE in_quantity INT(11) DEFAULT 0;
	DECLARE in_total_sold_tickets INT(11) DEFAULT 0;
	DECLARE in_status TINYINT(1) DEFAULT 0;
	DECLARE total_tickets INT(11) DEFAULT 0;
	DECLARE is_sold TINYINT(1) DEFAULT 0;

	SELECT quantity,no_of_tickets_sold, is_sold_out INTO in_quantity, in_total_sold_tickets, in_status
 	FROM event_tickets
	WHERE id = ticket_id;

	SET total_tickets = (in_quantity - in_total_sold_tickets);
	SET status = false;
	IF in_status = 1 THEN
		SET status = false;
	ELSE
		IF total_tickets > 0 THEN
			SET status = true;
			SET is_sold=0;
			SET total_tickets = in_total_sold_tickets+input_quantity;
			IF total_tickets = in_quantity THEN
				SET is_sold=1;
			END IF;
			UPDATE event_tickets SET is_sold_out=is_sold, no_of_tickets_sold=total_tickets where id = ticket_id;
		END IF;
	END IF;
	SELECT status;
END $$

DELIMITER ;


DELIMITER $$



DROP PROCEDURE ticket_reset;

DELIMITER $$

CREATE PROCEDURE ticket_reset(
	IN ticket_id int(10),
	IN input_quantity int(10),
	OUT status boolean
)
BEGIN
	DECLARE in_quantity INT(11) DEFAULT 0;
	DECLARE in_total_sold_tickets INT(11) DEFAULT 0;
	DECLARE in_status TINYINT(1) DEFAULT 0;
	DECLARE total_tickets INT(11) DEFAULT 0;
	DECLARE is_sold TINYINT(1) DEFAULT 0;

	SELECT quantity,no_of_tickets_sold, is_sold_out INTO in_quantity, in_total_sold_tickets, in_status
 	FROM event_tickets
	WHERE id = ticket_id;
	SET status = true;
	
	SET total_tickets = in_total_sold_tickets-input_quantity;
	SET is_sold = in_status;
	IF total_tickets!=in_quantity THEN
		SET is_sold = 0;
	END IF;
	UPDATE event_tickets SET is_sold_out=is_sold, no_of_tickets_sold=total_tickets where id = ticket_id;
	SELECT status;
END $$

DELIMITER ;

DELIMITER $$
