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
		is_allow_origin:true,
		base_url:'http://localhost:8012',
  	 	file_upload_limit:'50mb',
        disable_multiple_login:false,
        reset_password_link_expiry_hours:3,
        reset_password_link:"http://10.9.161.85:8013/#/reset_password",
        forgot_password_link:"http://10.9.161.85:8013/#/forgot_password",
		allowedOrigins:['localhost:8012', 
		'https://up-events.now.sh', 'http://localhost:8012', 'http://localhost:8015', 'http://127.0.0.1:8012', 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop'],
		email:{
			from:'damovenkatesh@gmail.com',
			host: 'smtp.gmail.com', // hostname
			port: 465, 	
			secureSSLConnection:false,
			transportMethod: 'SMTP',
			user:'dhamodaran@constient.com',
			pass1:'Damovenkatesh@2610'
		},
		stripe:{
			public_key:'pk_test_vqZwdj6reVGYdCD4QQDnGZ6c00U08F91uY',
			securet_key:'sk_test_q6k0MJ6k505oyprB19bhj9lW002l06yqmt'
		}
}	
