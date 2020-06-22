global.EMAIL_CONFIG = {}
EMAIL_CONFIG.customer_register = {
	name: "Customer Register",
	subject : "BuyUrTicket - Welcome",
	template_name: "customer_register"
}

EMAIL_CONFIG.guest_customer_register = {
	name: "Customer Register",
	subject : "BuyUrTicket - Welcome",
	template_name: "guest_customer_register"
}

EMAIL_CONFIG.forgot_password = {
	name: "ForGot Password",
	subject : "BuyUrTicket - Forgot Password",
	template_name: "forgot_password"
}

EMAIL_CONFIG.email_verification = {
	name: "Email Verification",
	subject : "BuyUrTicket - Email Verification",
	template_name: "email_verification_success"
}


EMAIL_CONFIG.event_book_ticket_buyer_invoice = {
	name: "Buyer Ticket Booked Notification",
	subject : "BuyUrTicket - Your Tickets Booked Successfully",
	template_name: "event_book_ticket_buyer_invoice"
}


EMAIL_CONFIG.reset_password = {
	name: "Reset Password",
	subject : "BuyUrTicket - Password Reset Successfully",
	template_name: "reset_password"
}

EMAIL_CONFIG.change_password = {
	name: "Change Password",
	subject : "BuyUrTicket - Password Changed Successfully",
	template_name: "change_password"
}

EMAIL_CONFIG.event_add_waitng_for_approval = {
	name: "Event Add",
	subject : "BuyUrTicket - Your Event Almost Completed",
	template_name: "event_creation"
}

EMAIL_CONFIG.event_admin_approval = {
	name: "Event Approval",
	subject : "BuyUrTicket - Event Approved Successfully",
	template_name: "event_approved"
}

EMAIL_CONFIG.event_admin_declined = {
	name: "Event Declined",
	subject : "BuyUrTicket - Your Event Got Declined",
	template_name: "event_decline"
}

EMAIL_CONFIG.event_ticket_booked = {
	name: "Ticket Booked Notification",
	subject : "BuyUrTicket - Your Tickets Booked Successfully",
	template_name: "event_book_ticket_invoice"
}

EMAIL_CONFIG.event_remainder_notification = {
	name: "Event Remainder Notification",
	subject : "BuyUrTicket - Event Remainder Notification",
	template_name: "event_remainder_notification"
}