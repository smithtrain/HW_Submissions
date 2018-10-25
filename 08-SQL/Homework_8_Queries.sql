# SQL Homework
USE sakila;

SELECT actor.* FROM actor;

#1a. Display the first and last names of all actors from the table actor.
SELECT actor.first_name, actor.last_name FROM actor;

#1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT concat(actor.first_name," ",actor.last_name ) AS 'Actor Name' FROM actor;

#2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor.actor_id, actor.first_name, actor.last_name 
FROM actor
WHERE actor.first_name = 'Joe';

#2b. Find all actors whose last name contain the letters GEN:
SELECT actor.actor_id, actor.first_name, actor.last_name 
FROM actor
WHERE actor.last_name LIKE '%GEN%';

#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT actor.actor_id, actor.first_name, actor.last_name 
FROM actor
WHERE actor.last_name LIKE '%LI%'
ORDER BY actor.last_name, actor.first_name;

#3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
ALTER TABLE actor
ADD COLUMN description TINYBLOB;

#3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
ALTER TABLE actor
DROP COLUMN description;


#4a. List the last names of actors, as well as how many actors have that last name.
SELECT actor.last_name, COUNT(actor_id) AS 'Last Name Count'
FROM actor
GROUP BY actor.last_name;

#4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT actor.last_name, COUNT(actor_id) AS 'Last Name Count'
FROM actor
GROUP BY actor.last_name
HAVING COUNT(actor_id)>1;

#4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
UPDATE actor SET actor.first_name = "HARPO"
WHERE (actor.first_name="GROUCHO" AND actor.last_name="WILLIAMS");

#4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
UPDATE actor SET actor.first_name = "GROUCHO"
WHERE (actor.first_name="HARPO" AND actor.last_name="WILLIAMS");

#5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
	#Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html
SHOW CREATE TABLE address;

#6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT staff.first_name, staff.last_name, address.address, address.address2
FROM staff
INNER JOIN address ON
address.address_id=staff.address_id;

#6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT staff.first_name, staff.last_name, SUM(payment.amount)
FROM staff
INNER JOIN payment ON
payment.staff_id=staff.staff_id
GROUP BY staff.staff_id;

#6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT film.title, COUNT(film_actor.actor_id) as '# of actors'
FROM film
INNER JOIN film_actor ON
film_actor.film_id=film.film_id
GROUP BY film.title;

#6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT film.title, COUNT(inventory.inventory_id) as '# of copies'
FROM film
INNER JOIN inventory ON
inventory.film_id=film.film_id
GROUP BY film.title
HAVING film.title='HUNCHBACK IMPOSSIBLE';

#6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
	#![Total amount paid](Images/total_payment.png)
SELECT customer.first_name, customer.last_name, SUM(payment.amount) as 'Total Paid'
FROM customer
INNER JOIN payment ON
payment.customer_id=customer.customer_id
GROUP BY customer.customer_id
ORDER BY customer.last_name;

    
#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT film.title 
FROM film
WHERE (film.title IN
(
  SELECT film.title
  FROM film
  INNER JOIN language ON
  language.language_id=film.language_id
  WHERE language.name='English'
)
AND film.title IN
(
  SELECT film.title
  FROM film
  INNER JOIN language ON
  language.language_id=film.language_id
  WHERE (film.title LIKE 'K%' OR film.title LIKE 'Q%')
));


#7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT actor.first_name, actor.last_name
FROM actor
INNER JOIN film_actor ON
film_actor.actor_id=actor.actor_id
WHERE film_actor.film_id IN
(
  SELECT film.film_id
  FROM film
  WHERE (film.title='ALONE TRIP')
);

#7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
SELECT customer.first_name, customer.last_name, customer.email
FROM customer
INNER JOIN (address, city, country) ON (customer.address_id=address.address_id AND address.city_id=city.city_id AND city.country_id=country.country_id)
WHERE (country.country='Canada');

#7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
SELECT film.title, film.film_id, category.name
FROM film
INNER JOIN (film_category, category) ON (film.film_id=film_category.film_id AND film_category.category_id=category.category_id)
WHERE (category.name = 'Family');

#7e. Display the most frequently rented movies in descending order.
SELECT film.title, film.film_id, COUNT(rental.rental_id) as '# of times Rented'
FROM film
INNER JOIN (inventory, rental) ON (film.film_id=inventory.film_id AND inventory.inventory_id=rental.inventory_id)
GROUP BY film.title
ORDER BY COUNT(rental.rental_id) DESC;

#7f. Write a query to display how much business, in dollars, each store brought in.
SELECT store.store_id, SUM(payment.amount) as 'Business ($)'
FROM store
INNER JOIN (customer, payment) ON (store.store_id=customer.store_id AND customer.customer_id=payment.customer_id)
GROUP BY store.store_id
ORDER BY COUNT(payment.amount) DESC;

#7g. Write a query to display for each store its store ID, city, and country.
SELECT store.store_id, city.city, country.country
FROM store
INNER JOIN (address, city, country) ON (store.address_id=address.address_id AND address.city_id=city.city_id AND city.country_id=country.country_id);


#7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT category.name, SUM(payment.amount) as 'Rental ($)'
FROM category
INNER JOIN (film_category, inventory, rental, payment) ON (category.category_id=film_category.category_id AND film_category.film_id=inventory.film_id AND inventory.inventory_id=rental.inventory_id AND rental.rental_id=payment.rental_id)
GROUP BY category.name
ORDER BY SUM(payment.amount) DESC
LIMIT 5;

#8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW Stinger
AS
SELECT category.name, SUM(payment.amount) as 'Rental ($)'
FROM category
INNER JOIN (film_category, inventory, rental, payment) ON (category.category_id=film_category.category_id AND film_category.film_id=inventory.film_id AND inventory.inventory_id=rental.inventory_id AND rental.rental_id=payment.rental_id)
GROUP BY category.name
ORDER BY SUM(payment.amount) DESC
LIMIT 5;

#8b. How would you display the view that you created in 8a?
SELECT Stinger.* FROM Stinger;

#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW Stinger;
SELECT Stinger.* FROM Stinger;