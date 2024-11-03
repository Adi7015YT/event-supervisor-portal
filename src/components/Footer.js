const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className="w-full bg-gray-200 py-4 text-center text-black fixed bottom-0 text-xs md:text-sm px-4">
            <p>
                <strong>
                    &copy; {year} 
                    <a 
                        href="http://gdgocmakaut.co.in/" 
                        target="_blank"
                        className="text-blue-500 hover:underline"
                    >
                        &nbsp;GDG on Campus - MAKAUT
                    </a>. All Rights Reserved.
                </strong>
            </p>
        </div>
    );
};

export default Footer;
