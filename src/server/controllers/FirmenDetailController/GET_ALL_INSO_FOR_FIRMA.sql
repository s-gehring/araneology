select
    i.url as url,
    i.date as datum,
    i.ort as ort
from Firmen f
    join Insolvenzbekanntmachungen i on i.schuldner=f.id
where f.id=?
