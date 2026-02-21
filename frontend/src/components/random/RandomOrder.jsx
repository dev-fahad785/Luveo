import { useEffect, useState, useCallback } from "react";

const names = [
    "Ahmed", "Ayesha", "Hassan", "Fatima", "Bilal", "Zainab",
    "Usman", "Maryam", "Ali", "Noor", "Ibrahim", "Hina",
    "Omar", "Khadija", "Tariq", "Saima", "Waleed", "Amina","Shahryar","Moeed","Saleem",
    "Sana", "Faisal", "Zara", "Asad", "Nida", "Rehan",
    "Sadia", "Bilqis", "Yasir", "Hira", "Saqib", "Nazia", "Areeba", "Hamza", "Raza", "Adeel", "Sami", "Hafsa", "Zeeshan", "Rabia", "Fahad", "Saira",
];

const locations = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar",
    "Multan", "Faisalabad", "Hyderabad", "Quetta", "Sialkot",
    "Gujranwala", "Bahawalpur", "Sargodha", "Sahiwal", "Gujrat",
    "Mardan", "Abbottabad", "Mirpur", "Skardu", "Muzaffarabad",
    "Gilgit", "Swat", "Bannu", "Dera Ismail Khan", "Kohat", "Nowshera",
];

const actions = [
    "just ordered",
    "is viewing",
    "added to cart",
    "purchased",
    "is interested in"
];

const products = [
    "Acer OHR 503 Wireless Earbuds",
    "Air31 TWS Earbuds",
    "Glowz-A9 Pro Touch Screen Airpods",
    "Glowz - 895B Bluetooth TWS Wireless Earphone",
    "Glowz-A6S TWS Headset Wireless Earphones",
    "Hoco EQ2 Earbuds",
    "Lenovo GM2 Pro Wireless Bluetooth Headset",
    "H9 Pro Max Series 9 Smart Watch"
];

const urgencyMessages = [
    "Limited stock",
    "Trending now",
    ""
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const getRandomTime = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const NotificationPopup = () => {
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const createNotification = useCallback(() => {
        return {
            name: getRandomItem(names),
            location: getRandomItem(locations),
            product: getRandomItem(products),
            action: getRandomItem(actions),
            urgency: Math.random() < 0.2 ? getRandomItem(urgencyMessages) : "",
            timestamp: Date.now()
        };
    }, []);

    useEffect(() => {
        let showTimer, hideTimer, nextNotificationTimer;

        const showNotification = () => {
            setNotification(createNotification());
            setVisible(true);

            // Show for 5 seconds
            const displayDuration = getRandomTime(4500, 5500);

            hideTimer = setTimeout(() => {
                setVisible(false);

                // Gap before next
                setTimeout(() => {
                    const gapDuration = getRandomTime(5000, 8000);
                    nextNotificationTimer = setTimeout(showNotification, gapDuration);
                }, 600); 

            }, displayDuration);
        };

        showNotification();

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(nextNotificationTimer);
        };
    }, [createNotification]);

    if (!notification) return null;

    return (
        <div 
            style={{
                position: "fixed",
                bottom: 30,
                left: 30,
                zIndex: 9999,
                width: 340,
                maxWidth: "calc(100vw - 60px)",
                background: "var(--prada-black)",
                color: "var(--prada-white)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "18px 24px",
                transform: visible ? "translateY(0)" : "translateY(20px)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease",
                pointerEvents: visible ? "auto" : "none",
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                backdropFilter: "blur(8px)"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setVisible(false)}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)"
                }}>
                    Live Activity
                </span>
                {notification.urgency && (
                    <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--prada-white)",
                        paddingBottom: 2,
                        borderBottom: "1px solid var(--prada-white)",
                        opacity: isHovered ? 1 : 0.7,
                        transition: "opacity 0.3s"
                    }}>
                        {notification.urgency}
                    </span>
                )}
            </div>

            <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                fontWeight: 300,
                lineHeight: 1.4,
                margin: "0 0 12px",
                color: "var(--prada-white)"
            }}>
                {notification.name} {notification.action}{" "}
                <span style={{ borderBottom: "1px solid rgba(255,255,255,0.4)" }}>
                    {notification.product}
                </span>{" "}
                from {notification.location}.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 4, background: "var(--prada-white)", borderRadius: "50%" }}></div>
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)"
                }}>
                    Just now
                </span>
            </div>
        </div>
    );
};

export default NotificationPopup;