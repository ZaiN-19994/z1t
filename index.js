require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/update", async (req, res) => {
    const { newTitle, newLink, newImage } = req.body;

    const username = "zainco94";
    const repo = "Z1";
    const filePath = "index.html";
    const token = process.env.GITHUB_TOKEN;

    const url = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `token ${token}` }
        });

        const fileData = response.data;
        let content = Buffer.from(fileData.content, 'base64').toString('utf-8');

        if (newTitle) {
            content = content.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);
        }
        if (newLink) {
            content = content.replace(/file:"(https?:\/\/[^"\s]+)"/, `file:"${newLink}"`);
        }
        if (newImage) {
            content = content.replace(/image: "(https?:\/\/[^"\s]+)"/, `image: "${newImage}"`);
        }

        const encodedContent = Buffer.from(content, 'utf-8').toString('base64');

        await axios.put(url, {
            message: "تحديث البيانات المطلوبة",
            content: encodedContent,
            sha: fileData.sha
        }, {
            headers: {
                Authorization: `token ${token}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ message: "تم تعديل البيانات بنجاح!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "حدث خطأ أثناء التعديل" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
