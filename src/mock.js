import { setupWorker, rest } from 'msw';
var Data = [
    {
        title: "this is title of data 1",
        body: "Body of 1st dataBody of 1st dataBody of 1st dataBody of 1st dataBody of 1st dataBody of 1st dataBody of 1st data"
    },
    {
        title: "this is title of data 2",
        body: "Body of 2nd data",
        new: true
    },
    {
        title: "this is title of data 3",
        body: " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore"
    },
    {
        title: "This is random title",
        body: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronit sheets containing Lore"
    },
    {
        title: "Hi this also tilte",
        body: "t ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore",
        new: true
    },
    {
        title: "this is another title",
        body: "Some random text Some random text Some random text Some random text"
    },
    {
        title: "India is a deleveloping country",
        body: " when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore"
    }
    ,
    {
        title: "Hi how are you today",
        body: " when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore"
    }
    ,
    {
        title: "There are so many title",
        new: true,
        body: "scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore"
    },
    {
        title: "This is last title",
        body: "Last tilte ype specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lore"
    }


];
Data = Data.map((d, id) => {
    return { ...d, id, replies: [], new: d.new ? d.new : false, archived: false, img: `/img${id + 1}.jpg` }
});
Data = JSON.stringify({ allData: Data })
const worker = setupWorker(
    rest.post('/login', (req, res, ctx) => {
        const { id, pass } = JSON.parse(req.body);
        if (!id || !pass) {
            return res(
                ctx.status(401),
                ctx.json({ err: "All fields are required" })
            )
        }
        return res(
            ctx.status(200),
            ctx.json(JSON.parse(Data).allData)
        )
    })
)
export default worker;