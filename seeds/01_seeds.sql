-- users TABLE
INSERT INTO users(id, name, email, password)
VALUES(15, 'Ancient One', 'ancient_one@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(16, 'Bucky Barnes', 'bucky_barnes@tunes.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(17, 'Ralph Bohner', 'r_bohner@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


-- properties TABLE
INSERT INTO properties(id, owner_id, title, description, thumbnail_photo_url,
  cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,
  number_of_bedrooms, street, city, province, country, post_code, active)

VALUES(1, 15, 'Bonheim Place', 'A B&B trying to sound fancy.', 'thumbnail_link1',
  'cover_photo_link1', 159, 1, 1, 2, '38 Major Rd.', 'Raleigh', 'ON', 'CA',
  'D2T 8N1', true),

(2, 16, 'Motel 3', 'A cheap motel.', 'thumbnail_link2',
  'cover_photo_link2', 115, 1, 1, 1, '8393 Eglinton Rd.', 'Toronto', 'ON', 'CA',
  'B3G 7K1', true),

(3, 17, 'Giant Hotel', 'A highend hotel.', 'thumbnail_link3',
  'cover_photo_link3', 500, 1, 2, 2, '38A Janice St.', 'Nanaimo', 'BC', 'CA',
  'U2K 0P2', true);


-- reservations TABLE
INSERT INTO reservations(id, property_id, guest_id, start_date, end_date)
VALUES(1, 1, 15, '2024-04-20', '2024-04-28'),
(2, 2, 16, '2024-03-15', '2024-03-17'),
(3, 3, 17, '2024-05-02', '2024-05-11');


-- property_reviews TABLE
INSERT INTO property_reviews(id, guest_id, property_id, reservation_id, rating,
  message)
VALUES(1, 15, 1, 1, 2, 'Not great!'),
(2, 16, 2, 2, 3, 'An average hotel!'),
(3, 17, 3, 3, 3, 'Too expensive!');