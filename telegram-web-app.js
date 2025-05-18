
// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Set up the main button
tg.MainButton.text = "Proceed";
tg.MainButton.color = "#6C5CE7";
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.setParams({ is_visible: true });

// Event listener for the main button
tg.MainButton.onClick(() => {
    const userData = {
        userId: tg.initDataUnsafe.user.id,
        username: tg.initDataUnsafe.user.username,
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name,
    };

    // Send user data to the backend
    fetch("https://v0-paystack-serverless-backend.vercel.app/api/telegram-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                tg.MainButton.text = "Success!";
                tg.MainButton.color = "#00B894";
            } else {
                tg.MainButton.text = "Error!";
                tg.MainButton.color = "#D63031";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            tg.MainButton.text = "Error!";
            tg.MainButton.color = "#D63031";
        });
});

// Display user information
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = tg.initDataUnsafe.user;
    document.getElementById("userInfo").innerHTML = `
        <p><strong>ID:</strong> ${userInfo.id}</p>
        <p><strong>Username:</strong> ${userInfo.username || "N/A"}</p>
        <p><strong>First Name:</strong> ${userInfo.first_name}</p>
        <p><strong>Last Name:</strong> ${userInfo.last_name || "N/A"}</p>
    `;
});
