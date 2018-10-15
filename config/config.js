
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./moimlist_schema', collection:'moimlists', schemaName:'MoimListSchema', modelName:'MoimList'}
        ,{file:'./moim_schema', collection:'moims', schemaName:'MoimSchema', modelName:'Moim'}
        ,{file:'./moimtable_schema', collection:'moimtables', schemaName:'MoimTableSchema', modelName:'MoimTable'}
        ,{file:'./attendance_schema', collection:'attendances', schemaName:'AttendanceSchema', modelName:'Attendance'}
				,{file:'./history_schema', collection:'historys', schemaName:'HistorySchema', modelName:'History'}
        ,{file:'./comment', collection:'comments', schemaName:'CommentSchema', modelName:'Comment'}
        ,{file:'./board', collection:'boards', schemaName:'BoardSchema', modelName:'Board'}
	],
	route_info: [
	],
	facebook: {	// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}
