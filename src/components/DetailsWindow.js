import React from 'react';
import styles from './DetailsWindow.module.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { Icon } from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://i.postimg.cc/VLVhvxg8/image.png',
  iconSize: [40, 40], // Size of the icon, in pixels
  iconAnchor: [12.5, 41], // The point of the icon which will correspond to marker's location
  popupAnchor: [0, -41], // The point from which the popup will "open", relative to the iconAnchor
});
const DetailsWindow = ({ poi, coordinates }) => {
    console.log(poi)
  if (!poi) {
    return <p>Loading data...</p>;
  }

  const {
    "Site internet": siteInternet,
    "Date de création": dateDeCreation,
    Diocèse,
    Pays,
    Réseau,
    "Adresse pour la carte": adressePourLaCarte,
    "Doc 1 - Ref EcL": doc1RefEcL,
    Type,
    Contact,
    "Kairos / porte d'entrée": kairosPorteEntree,
    "Doc 1 - fichier": doc1Fichier,
    "Photo de présentation": photoDePresentation,
    "Ref photo de présentation": photoref,
    Name,
    Référence,
    "Doc 1 - Titre": doc1Titre,
    Activité,
    Initiative,
    "Monde rural ?": mondeRural,
    "Doc 1 - lien": doc1Lien,
    Adresse,
    "Qui l'a fourni": quiLaFourni,
    "Start date": startDate,
  } = poi;

  const location = [coordinates.lat, coordinates.lng];
  console.log("LOCATIONNN: ",location)
  return (
    <div className={styles.maindiv}>
    <div className="map-wrapper">
    <div className="inner-map-wrapper">
    <MapContainer center={location} zoom={13} style={{ height: "200px", width: "130vh",marginLeft:'-40px',marginTop:'-40px' }}>
      <TileLayer
          url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=PRjNGSEFreZIQnED5MQhvjyo2rCWBleGmAy2gHgL6cx2zlJl0TjXop6o4fAk0Gfh"
          attribution='&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a> contributors'
          minZoom={0}
          maxZoom={22}
          subdomains="abcd"
          accessToken="PRjNGSEFreZIQnED5MQhvjyo2rCWBleGmAy2gHgL6cx2zlJl0TjXop6o4fAk0Gfh"
        />
        <Marker
        position={location}
        icon={customIcon}
      ></Marker>
      </MapContainer>
      <div className={styles.mapFadeOverlay}></div>
      </div>
      </div>
    <div className={styles.detailsWindow}>
      
      <div className={styles.titdiv}>
        <p className={styles.title}>{Name}</p>
      </div>
      
      <p className={styles.address}><img src='https://i.postimg.cc/ryggPfbY/icons8-location-50.png' width={15} /> {Adresse}</p>
      <div>
        <p className={styles.nname}>Type</p>
            <p style={{marginTop:"-1%"}}>{Type?.join(', ')}</p>
      </div>
      <div>
            <p className={styles.nname}>Thématique</p>
            <p style={{marginTop:"-1%"}}>{kairosPorteEntree?.join(', ')}</p>
          </div>
      <p style={{fontSize:'25px',fontWeight:'600',color:'grey'}}>Description</p> 
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis</p>

        
      {/* <h3 className={styles.information}>Information</h3> */}
      <table>
        <tbody>
        <tr>
            <td><img style={{marginRight:"1%"}} width={25} src='https://i.postimg.cc/cJgRjBJx/article-ny-times-1.png'/><a href={doc1Lien}>{doc1Lien}</a></td>
          </tr>

          <tr>
            <td><img style={{marginRight:"1%"}} width={25} src='https://i.postimg.cc/7ZybD1XP/video-1.png'/><a href={doc1Lien}>{doc1Lien}</a></td>
          </tr>
          <tr>
            <td><img style={{marginRight:"1%"}} width={25} src='https://i.postimg.cc/Cx1LsFhD/headphones-1.png'/><a href={doc1Lien}>{doc1Lien}</a></td>
          </tr>
          <tr>
            <td><img style={{marginRight:"1%"}} width={25} src='https://i.postimg.cc/zBNspjCM/link-1.png'/><a href={doc1Lien}>{doc1Lien}</a></td>
          </tr>
          <hr style={{color:'grey'}}></hr>

          <tr>
          {photoDePresentation && (
            <td>
           
              <img
                src={photoDePresentation[0].thumbnails.large.url}
                alt={Name}
                width={photoDePresentation[0].thumbnails.large.width -100}
                height={photoDePresentation[0].thumbnails.large.height -100}
                className={styles.image}
              />
            
            </td>)}
            <td>
            <td style={{fontSize:'25px',fontWeight:'600',color:'grey'}}>Informations</td> 
               
              <tr className={styles.nname}>
                Réseau
            
              </tr>
              <tr>{Réseau?.join(', ')}</tr>

              <tr className={styles.nname}>
              Diocèse
            
              </tr>
              <tr>{Diocèse?.join(', ')}</tr>
              
            </td>
            <td>
            <td style={{fontSize:'25px',fontWeight:'600',color:'grey'}}>Histoire</td> 
               
               <tr className={styles.nname}>
                 Cree le
             
               </tr>
               <tr>{startDate}</tr>
 
               <tr className={styles.nname}>
               Initiative
             
               </tr>
               <tr>{Initiative?.join(', ')}</tr>
            </td>
          </tr>
          <tr>
            {/* <td>Site internet:</td> */}
            {/* <td><a href={siteInternet}>{siteInternet}</a></td> */}
          </tr>
          <tr>
            {/* <td>Date de création:</td> */}
            {/* <td>{dateDeCreation}</td> */}
          </tr>
          <tr>
            {/* <td>Diocèse:</td> */}
            {/* <td>{Diocèse?.join(', ')}</td> */}
          </tr>
          <tr>
            {/* <td>Pays:</td> */}
            {/* <td>{Pays}</td> */}
          </tr>
          <tr>
            {/* <td>Réseau:</td> */}
            {/* <td>{Réseau?.join(', ')}</td> */}
          </tr>
          <tr>
            {/* <td>Adresse pour la carte:</td> */}
            {/* <td>{adressePourLaCarte}</td> */}
          </tr>
          <tr>
            {/* <td>Doc 1 - Ref EcL: :</td> */}
            {/* <td>{doc1Titre}</td> */}
          </tr>
          <tr>
            {/* <td>Activité:</td> */}
            {/* <td>{Activité}</td> */}
          </tr>
          <tr>
            {/* <td>Initiative:</td> */}
            {/* <td>{Initiative?.join(', ')}</td> */}
          </tr>
          <tr>
            {/* <td>Monde rural ?:</td> */}
            {/* <td>{mondeRural}</td> */}
          </tr>
          <tr>
            {/* <td>Doc 1 - lien:</td> */}
            {/* <td><a href={doc1Lien}>{doc1Lien}</a></td> */}
          </tr>
          <tr>
            {/* <td>Qui l'a fourni:</td> */}
            {/* <td>{quiLaFourni}</td> */}
          </tr>
          <tr>
            {/* <td>Start date:</td> */}
            {/* <td>{startDate}</td> */}
          </tr>
          <tr>
            {/* <td>Type:</td> */}
            {/* <td>{Type?.join(', ')}</td> */}
          </tr>
          {/* <tr>
          <td style={{fontSize:'25px',fontWeight:'600',color:'grey'}}>Contact:</td> 
          </tr> */}
          {/* <tr>
            <td>{Contact}</td>
          </tr> */}
          
          {/* Add other rows similarly for the rest of the properties */}
        </tbody>
      </table>
      
      
      {/* <p style={{width:'40%',marginLeft:'50%',fontSize:'0.9rem'}}>{photoref}</p> */}
      
    </div>
    </div>
  );
};

export default DetailsWindow;
