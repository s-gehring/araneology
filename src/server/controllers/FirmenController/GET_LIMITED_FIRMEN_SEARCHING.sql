select id, name from Firmen where name like $search order by name limit $limit offset $offset