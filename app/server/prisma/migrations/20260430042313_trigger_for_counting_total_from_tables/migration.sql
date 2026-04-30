-- This is an empty migration.
CREATE FUNCTION count_total_from_table() RETURNS trigger AS
$count$
BEGIN
    IF (tg_op = 'DELETE') THEN
        UPDATE "TotalCount"
        SET total = total - 1
        WHERE "tableName" = tg_table_name;
    end if;

    IF (tg_op = 'INSERT') THEN
        UPDATE "TotalCount"
        SET total = total + 1
        WHERE "tableName" = tg_table_name;
    end if;

    IF (tg_op = 'TRUNCATE') THEN
        UPDATE "TotalCount"
        SET total = 0
        WHERE "tableName" = tg_table_name;
    end if;
    RETURN NULL;
END;
$count$ LANGUAGE plpgsql;
