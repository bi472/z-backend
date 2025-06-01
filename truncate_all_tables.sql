-- Active: 1748347046765@@127.0.0.1@5432@postgres
-- Скрипт для очистки всех таблиц в базе данных
-- Отключаем проверку foreign key constraints
SET session_replication_role = replica;

-- Очищаем все таблицы
TRUNCATE TABLE users_bookmarked_tweets_tweets CASCADE;
TRUNCATE TABLE users_followers_users CASCADE;
TRUNCATE TABLE users_liked_tweets_tweets CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE refresh_tokens CASCADE;
TRUNCATE TABLE files CASCADE;
TRUNCATE TABLE tweets CASCADE;
TRUNCATE TABLE users CASCADE;

-- Включаем обратно проверку foreign key constraints
SET session_replication_role = DEFAULT;

-- Сбрасываем последовательности (auto-increment)
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE tweets_id_seq RESTART WITH 1;
ALTER SEQUENCE notifications_id_seq RESTART WITH 1;
ALTER SEQUENCE refresh_tokens_id_seq RESTART WITH 1;

SELECT 'Все таблицы успешно очищены!' as message;
