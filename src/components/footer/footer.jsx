// import  'bootstrap/dist/css/bootstrap.min.css' ;
// import './style.css';
// import { Card, Button } from 'react-bootstrap';
// import { useState, useEffect } from 'react';
// import playlistImage from '../../assets/generalPlaylistImage.jpg'


// function Footer(playlist, show, onClose, track){

//    // const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem("createdPlaylist")));

//     const [image, setImage] = useState(playlistImage);

//     useEffect(() => {
//         if (playlist.image) {
//             setImage(playlist.image)
//         }
//         }, [])

//     function close(){
//         localStorage.removeItem('createdPlaylist')
//         onClose();
//     }
    

//     if (playlist&&show){
//         return (
//             <>
            
//             <Card className='card d-flex flex-row bg-dark text-light' >
//                 <div className='back'></div><Card.Img className='cardImg' src={image}/>
//                 <Card.Body className='cardbody'>
//                     <h1>{playlist.name}</h1>
//                     <h5>{playlist.ownerName}</h5>
//                 </Card.Body>
//                 <div className='scritta'><h1>Aggiungi delle Tracce alla playlist selezionata</h1></div>
//                 <Button className='action btn-light' onClick={close}>Chiudi</Button>
//             </Card>
//             </>
//         )
//     }

//     return(
//         <div></div>
//     )
    
// }

// export default Footer