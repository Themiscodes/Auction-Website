import React from 'react';
import Axios from 'axios';

// To download the XML
export function DownloadXML(props){
    const download=(e)=>{


        Axios({
            url: 'https://localhost:33123/items/downloadXML/',
            method: 'GET',
            responseType: 'text', // important text here not blob to keep the formatting
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                username: props.username,
                },
        }).then((response) => {
            
            const create_url = window.URL.createObjectURL(new Blob([response.data]));
            const generate_link = document.createElement('a');

            generate_link.href = create_url;
            generate_link.setAttribute('download', 'auctions.xml');
            document.body.appendChild(generate_link);
            generate_link.click();
        });
    }

    return (
        <div>
            <button className="buttonito" onClick={download} >Download XML</button>
        </div>
    );

}