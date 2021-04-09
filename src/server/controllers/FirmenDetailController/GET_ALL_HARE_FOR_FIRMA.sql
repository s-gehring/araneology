select
    h.url as url,
    h.ereignisDatum as ereignisDatum,
    h.amtsgericht as amtsgericht
from Firmen f
    join Handelsregisterbekanntmachungen h on h.firma=f.id
where f.id=?
