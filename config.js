module.exports = {
		port: 8012,
		dbConnectionString: 'mysql://root:Passw0rd@localhost/event_portal',
		saltRounds: 2,
		jwtSecret: 'yo-its-a-secret',
		tokenExpireTimeInHours: '6',
		Aes_key : 'b093986d5fdbafbc23f23ab35696042d',
		is_encryption: false,
		report_limit :10,
		db_migration:true,
		is_acl_enabled:true,
		is_ssl_enabled:false,
		is_allow_origin:true,
		base_url:'http://localhost:8012',
  	 	file_upload_limit:'50mb',
        disable_multiple_login:false,
        reset_password_link_expiry_hours:3,
        reset_password_link:"http://10.9.161.85:8013/#/reset_password",
        forgot_password_link:"http://10.9.161.85:8013/#/forgot_password",
		allowedOrigins:['http://localhost:8012', 'http://localhost:8015', 'http://127.0.0.1:8012', 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop'],
		instamojo:{
			api_key:'test_c5bf66b403f3db0371196384b38',
			auth_key:'test_e54d9cfa05483eaa25d692bb1cd',
			is_sandbox_mode:true,
			send_sms:false,
			send_email:false
		},
		email:{
			from:'damovenkatesh@gmail.com',
			host: 'smtp.gmail.com', // hostname
			port: 465, 	
			secureSSLConnection:false,
			transportMethod: 'SMTP',
			user:'dhamodaran@constient.com',
			pass1:'Damovenkatesh@2610'
		}
}	
