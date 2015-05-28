DO
$$body$$
BEGIN
  IF NOT EXISTS(
    SELECT * FROM pg_catalog.pg_user 
    WHERE usename = "$$$USERNAME$$$"
  ) THEN CREATE USER "$$$USERNAME$$$" WITH PASSWORD '$$$USERPASSWORD$$$';
END
$$body$$

