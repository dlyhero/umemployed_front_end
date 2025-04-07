const { useState, useEffect } = require("react");

const useScrollTop = (threshold=10) =>{
    const [scrollTop, setScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > threshold){
                setScrollTop(true);
            }
            else{
                setScrollTop(false);
            }
        }
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    })

    return scrollTop;
}

export default useScrollTop