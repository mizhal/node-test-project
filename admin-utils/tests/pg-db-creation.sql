DO
$$body$$
BEGIN
  IF NOT EXISTS(
    SELECT * FROM pg_catalog.pg_database
    WHERE datname = "$$$DBNAME$$$"
  ) THEN CREATE DATABASE "$$$DBNAME$$$" WITH OWNER "$$$USERNAME$$$";
END
$$body$$