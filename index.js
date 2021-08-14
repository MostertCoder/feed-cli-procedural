const fs = require("fs");

const users = [];
const tweets = [];

try {
    if (!fs.existsSync("./data-files/user.txt")) {
        throw new Error("File not found: user.txt");
    }

    const userData = fs
        .readFileSync("./data-files/user.txt", "utf8")
        .replace(/\r\n/g, "\n");

    if (userData.length > 0) {
        userLines = userData.split("\n");

        userLines.forEach((line) => {
            let lineArr = line.split(" follows ");

            if (lineArr.length === 2) {
                const name = lineArr[0];
                const following = lineArr[1].split(",").map((f) => f.trim());

                if (users.some((u) => u.name === name)) {
                    const userIndex = users.findIndex((e) => e.name === name);

                    following.forEach((follower) => {
                        if (users[userIndex].following.indexOf(follower) === -1) {
                            users[users.findIndex((e) => e.name === name)].following.push(
                                follower
                            );
                        }
                    });
                } else {
                    users.push({
                        name: name,
                        following: following,
                    });
                }

                following.forEach((follower) => {
                    if (!users.some((u) => u.name === follower)) {
                        users.push({
                            name: follower,
                            following: [],
                        });
                    }
                });
            }
        });

        users.sort((userA, userB) => {
            const nameA = userA.name.toUpperCase();
            const nameB = userB.name.toUpperCase();

            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
    } else {
        throw new Error("File empty: user.txt");
    }

    if (!fs.existsSync("./data-files/tweet.txt")) {
        throw new Error("File not found: tweet.txt");
    }

    const tweetData = fs
        .readFileSync("./data-files/tweet.txt", "utf8")
        .replace(/\r\n/g, "\n");

    if (tweetData.length > 0) {
        tweetLines = tweetData.split("\n");

        tweetLines.forEach((line) => {
            let lineArr = line.split("> ");

            if (lineArr.length === 2) {
                const name = lineArr[0];
                const tweet = lineArr[1];

                if (tweet.length < 280) {
                    tweets.push({
                        name: name,
                        tweet: tweet,
                    });
                } else {
                    throw new Error("Invalid tweet length: tweet.txt");
                }
            }
        });
    } else {
        throw new Error("File empty: tweet.txt");
    }
} catch (error) {
    console.log(error);
}

users.forEach((user) => {
    console.log(user.name);

    if (user.following.length > 0) {
        tweets.forEach((tweet) => {
            if (user.name === tweet.name || user.following.includes(tweet.name)) {
                console.log(`\t@${tweet.name}: ${tweet.tweet}`);
            }
        });
    }

    console.log("\n");
});
