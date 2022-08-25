-- DROP TABLE requests;
-- DROP type req_status;

-- CREATE TYPE req_status AS ENUM('not seen', 'approved', 'rejected');

-- CREATE TABLE requests(
--   id serial NOT NULL UNIQUE PRIMARY KEY,
--   "name" VARCHAR(200) NOT NULL,
--   phone_number VARCHAR(15) NOT NULL,
--   "description" TEXT NOT NULL,
--   "date" Date NOT NULL,
--   "time" Time NOT NULL,
--   "status" req_status NOT NULL,
--   "user_id" INT NOT NULL REFERENCES users (id)
-- );

-- ALTER TABLE requests
-- ALTER "status" SET DEFAULT ('not seen');

-- INSERT INTO requests ("name", phone_number, "description", "date","time","user_id")
-- VALUES ('amir', 23, 'salam', '2022-08-24','22:11:00',1)

DELETE FROM users WHERE email='admin@mail.com'
