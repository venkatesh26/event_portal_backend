module.exports = {
		port: 8012,
		dbConnectionString: 'mysql://root:Passw0rd@localhost/event_portal',
		saltRounds: 2,
		jwtSecret: 'yo-its-a-secret',
		tokenExpireTimeInHours: '6',
		Aes_key : 'b093986d5fdbafbc23f23ab35696042d',
		is_encryption: false,
		db_migration:false,
		is_acl_enabled:true,
		is_ssl_enabled:false,
		is_allow_origin:false,
		base_url:'http://localhost:8012',
  	 	file_upload_limit:'50mb',
        disable_multiple_login:false,
        reset_password_link_expiry_hours:3,
        reset_password_link:"http://localhost:8012/reset_password",
        forgot_password_link:"http://localhost:8012/forgot_password",
        account_verification_link:"http://localhost:8012/email_verification",
		allowedOrigins:[
			'localhost:8012', 
			'https://up-events.now.sh', 
			'http://localhost:8012', 
			'http://localhost:8015', 
			'http://127.0.0.1:8012', 
			'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop'
		],
		default_mail_server:'default',
		email_servers:{
			default : {	            
			from:'dhamodaran@constient.com',
            host: 'smtp.gmail.com', // hostname
            port: 465,  
            secureSSLConnection:true,
            transportMethod: 'SMTP',
            user:'dhamodaran@constient.com',
            pass:'damo@2610',
            send_to_test_email:true,
            test_email:'damovenkatesh@gmail.com'
			}
		},
		stripe:{
			public_key:'pk_test_vqZwdj6reVGYdCD4QQDnGZ6c00U08F91uY',
			securet_key:'sk_test_q6k0MJ6k505oyprB19bhj9lW002l06yqmt'
		}
}	
