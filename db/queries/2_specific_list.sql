SELECT name, description,priority, is_checked
FROM lists
JOIN users On lists.user_id = users.id
Where users.id = 1
AND list_type = 'e'
GROUP BY list_type
LIMIT 4;






