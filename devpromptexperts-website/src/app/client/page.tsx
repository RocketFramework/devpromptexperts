'use client';

export default function ClientButton() {
    const handle_click = () => {
        console.log("clicked");
    };

    return (
        <button onClick={handle_click}> CLICK </button>
    );
}