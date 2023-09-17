import React, { useState, useEffect,useRef } from 'react';
import Airtable from 'airtable';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster'
import { v4 as uuidv4 } from 'uuid';
import L, { Icon } from 'leaflet';
import './App.css';
import DetailsWindow from './components/DetailsWindow';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingSpinner from './components/LoadingSpinner';
import Select from 'react-select';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';


const RedCheckbox = styled(Checkbox)({
  '&.Mui-checked': {
    color: 'red',
  },
});

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#8eb4cb"
      : state.isFocused
      ? "#e2e2e2"
      : "#f0f0f0",
  }),
  control: (provided) => ({
    ...provided,
    width: 250,
  }),
};


const App = () => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);
  const [windowContent, setWindowContent] = useState("");
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [loco,setLoco] = useState({});
  const [selectedPoiIndex, setSelectedPoiIndex] = useState(null);
  const [showAllFilters, setShowAllFilters] = React.useState(false);
  const [inputValue, setInputValue] = useState('');
  
  



  const handleMarkerClick = (poi,latLng) => {
    setSelectedPoi(poi);
    setIsPaneOpen(true);
    setNav(false);
    setLoco(latLng);
};




const clearFilters = () => {
  setFilters({ type: [], region: [], Monderural: [], Activité: [], search: '' });
  setFilteredData(Findata);
};


const [loading, setLoading] = useState(true);
  const [Findata, setFinData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const [filters, setFilters] = useState({
    type: [],
    region: [],
    Monderural: [],
    Activité: [],
    search: ''
  });
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [uniqueMonderurals, setUniqueMonderurals] = useState([]);
  const [uniqueActivités, setUniqueActivités] = useState([]);
  const [isNavOpen,setNav] = useState(true);

  const [selectedregion, setselectedRegion] = useState(null);
  const [type, setType] = useState(null);
  const [monderural, setMonderural] = useState(null);
  const [activite, setActivite] = useState(null);

  // const [typeOptions, setTypeOptions] = useState([]);
  const [reigionOptions, setReigionOptions] = useState([]);
  const [MondeOptions, setMondeOptions] = useState([]);
  const [activieOptions, setActivieOptions] = useState([]);
  const [expandedFilter, setExpandedFilter] = useState("");

  // use this state to hold the filter count
const [filterCount, setFilterCount] = useState(0);

// Create a ref for the filter box
const filterBoxRef = useRef();

// function to count the filters
const countFilters = () => {
  // count your filters here based on your filters state or other logic.
  // As an example, I am using the number of regions in the filters
  setFilterCount(filters.region.length+filters.Activité.length+filters.type.length+filters.Monderural.length);
}

// Add a useEffect hook to listen for filter changes
useEffect(() => {
  countFilters();
}, [filters]); // update when filters change

useEffect(() => {
  const handleClickOutside = (event) => {
    // If the click is outside the filter box, hide the filter box
    if (filterBoxRef.current && !filterBoxRef.current.contains(event.target)) {
      setShowFilterBox(false);
    }
  };
  
  // Add the event listener when the component mounts
  document.addEventListener('mousedown', handleClickOutside);
  
  // Remove the event listener when the component unmounts
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


  const handleFilterChange = (e, filterValue) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
    const { name } = e.target;
  
    if (name === "search") {
      // Handle search filter separately as it is a string
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: filterValue,
      }));
    } else {
      // Handle other filters as lists
      setFilters((prevFilters) => {
        // Check if filter already exists
        if (prevFilters[name].includes(filterValue)) {
          // Filter exists, remove it
          return {
            ...prevFilters,
            [name]: prevFilters[name].filter((value) => value !== filterValue),
          };
        } else {
          // Filter doesn't exist, add it
          return {
            ...prevFilters,
            [name]: [...prevFilters[name], filterValue],
          };
        }
      });
    }
  
    console.log("Filters are as following: ", filters);
  };
  

  const handleReactSelectFilterChange = (name, selectedOptions) => {
    setFilters((prevFilters) => {
      console.log ("selected ",selectedOptions)
      const value = selectedOptions.value;
      const newFilters = { ...prevFilters, [name]: value };
      const newFilteredData = applyFilters(newFilters, Findata);
      console.log("NEW", newFilteredData);
      setFilteredData(newFilteredData);
      return newFilters;
    });
  };

  
  
  
  const customIcon = new L.Icon({
    iconUrl: 'https://i.postimg.cc/VLVhvxg8/image.png',
    iconSize: [35, 35], // Size of the icon, in pixels
    iconAnchor: [12.5, 41], // The point of the icon which will correspond to marker's location
    popupAnchor: [0, -41], // The point from which the popup will "open", relative to the iconAnchor
  });

  const coordinates = [
    { id: 1, name: 'Point 1', lat: 40.7128, lng: -74.0060 },
    { id: 2, name: 'Point 2', lat: 40.7228, lng: -74.0160 },
    { id: 3, name: 'Point 3', lat: 40.7328, lng: -74.0260 },
  ];

  var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>', 
                           className: 'my-cluster-icon', 
                           iconSize: L.point(40, 40) });
    }
});


  
const applyFilters = (filters, data) => {

  console.log("Search is: ",filters.search)
  return data.filter((poi) => {
    const { Type: type, Pays: region, 'Monde rural ?': monderural, Activité: activité ,Name: poiName} = poi.fields;
    let matchesType = true;
    let matchesRegion = true;
    let matchesMonderural = true;
    let matchesActivité = true;
    let matchesSearch = true;

    if (filters.type && filters.type.length > 0) {
      matchesType = Array.isArray(type) 
        ? type.some(t => filters.type.includes(t)) 
        : filters.type.includes(type);
    }

    if (filters.region && filters.region.length > 0) {
      matchesRegion = filters.region.includes(region);
    }

    if (filters.Monderural && filters.Monderural.length > 0) {
      matchesMonderural = filters.Monderural.includes(monderural);
    }

    if (filters.Activité && filters.Activité.length > 0) {
      matchesActivité = filters.Activité.includes(activité);
    }

    if (filters.search && filters.search.length > 0) {
      const searchTerm = filters.search;
      matchesSearch = (poiName && poiName.toLowerCase().includes(searchTerm))
        || (Array.isArray(type) && type.some((t) => t.toLowerCase().includes(searchTerm)))
        || (region && region.toLowerCase().includes(searchTerm))
        || (monderural && monderural.toLowerCase().includes(searchTerm))
        || (activité && activité.toLowerCase().includes(searchTerm));
    }

    return matchesType && matchesRegion && matchesMonderural && matchesActivité && matchesSearch;
  });
};

useEffect(() => {
  const newFilteredData = applyFilters(filters, Findata);
  setFilteredData(newFilteredData);
}, [filters]);
  
  
  const extractUniqueFilterValues = (data) => {
    const typeSet = new Set();
    const regionSet = new Set();
    const MonderuralSet = new Set();
    const ActivitéSet = new Set();

  
    data.forEach((record) => {
      const { Type: type, Pays: region, 'Monde rural ?': monderural, Activité: activité } = record.fields;
  
      if (type && Array.isArray(type)) {
        type.forEach((t) => typeSet.add(t));
      } else if (type) {
        typeSet.add(type);
      }
  
      if (region) regionSet.add(region);
      if (monderural) MonderuralSet.add(monderural);
      if (activité) ActivitéSet.add(activité);
    });
  
    return {
      type: Array.from(typeSet),
      region: Array.from(regionSet),
      Monderural: Array.from(MonderuralSet),
      Activité: Array.from(ActivitéSet),
    };
  };
  
  

  const fetchLatLng = async (address,name) => {
    // console.log("Address is",address)
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://geocode.maps.co/search?q=${encodedAddress}`
    );
    const data = await response.json();
    // console.log(data[0])
    const result = data[0];
    const latLng = { id: uuidv4(),name:name,lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    // console.log("ADRESSS",latLng)
    return latLng;
    
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.airtable.com/v0/apphoIgzRLsBKDVDb/tblKNkyoSC9wkgpOO', {
          headers: {
            'Authorization': 'Bearer pat34jkGBzmyVdcHE.1914458b1d486527f0d5f89c6b68a68f0600130ea6c1b7499e358ea0e74eb22b',
          },
        });
        
        const airtableData = await response.json();
        const uniqueFilterValues = extractUniqueFilterValues(airtableData.records);
        setUniqueTypes(uniqueFilterValues.type);
        setUniqueRegions(uniqueFilterValues.region);
        setUniqueMonderurals(uniqueFilterValues.Monderural);
        setUniqueActivités(uniqueFilterValues.Activité);
        
        // setTypeOptions (uniqueTypes.map((type) => ({ value: type, label: type })));
        // setReigionOptions (uniqueRegions.map((type) => ({ value: type, label: type })));
        // setActivieOptions (uniqueActivités.map((type) => ({ value: type, label: type })));
        // setMondeOptions (uniqueMonderurals.map((type) => ({ value: type, label: type })));

        const dataWithLatLng = [];
        console.log ("Airtable Data is: ",airtableData.records)
        for (const record of airtableData.records) {
          const address = record.fields.Adresse;
          const name = record.fields.Name;
          let latLng = null;
  
          try {
            latLng = address ? await fetchLatLng(address, name) : null;
          } catch (error) {
            console.error(`Error fetching latLng for address: ${address}`, error);
          }
          
  
          dataWithLatLng.push({ ...record, latLng });
        }
  
        
        setFinData(dataWithLatLng);
        setFilteredData(dataWithLatLng);
        
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setLoading(false); // Add this line to indicate that the data fetching has finished
      }
    };
    fetchData();
  
  }, []);


const handleDivClick = (e) => {
  if (e.target.tagName.toLowerCase() !== 'input') {
    setExpandedFilter((current) => (current === 'region' ? '' : 'region'));
  }
  };

const handleDivClickType = (e) => {
  if (e.target.tagName.toLowerCase() !== 'input') {
    setExpandedFilter((current) => (current === 'type' ? '' : 'type'));
  }
  };
  const handleDivClickMonde = (e) => {
    if (e.target.tagName.toLowerCase() !== 'input') {
      setExpandedFilter((current) => (current === 'Monderural' ? '' : 'Monderural'));
    }
    };
  
  const handleDivClickActivit = (e) => {
    if (e.target.tagName.toLowerCase() !== 'input') {
      setExpandedFilter((current) => (current === 'Activité' ? '' : 'Activité'));
    }
    };
  console.log("ADRESSS", filteredData);
  // setLoading(false);

    // console.log ("Typeeess", uniqueMonderurals)
  return (
    <div>
      {loading ? (
        <div className="spinner-container">
        <LoadingSpinner />
      </div>
      ) : (
          <>
          <nav className={`navbar ${isNavOpen ? 'navbar-open' : 'navbar-closed'}`} style={{ 
            position: 'absolute', 
            zIndex: 1, 
            width: '100%', 
            top: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            }}>
            <div className='search-container' >
              <div className='search'>
                <button onClick={() => setShowFilterBox(!showFilterBox)}  style={{position:'absolute',marginLeft:'3px',marginTop:'3px',left:0,width:'50px'}}>
                  <img src='https://i.postimg.cc/dVhSRx2r/icons8-filter-60.png' width={23} ></img>
                  {filterCount > 0 && (
          <span style={{ fontSize:'0.6rem',position: 'absolute', top: 0, left: 0, backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 5px'}}>
            {filterCount}
          </span>
        )}
                </button>
                <input
                  type="text"
                  name="search"
                  placeholder="What are you looking for?"
                  value={filters.search}
                  onChange={(e) => handleFilterChange(e, e.target.value)}
                />
                <button  style={{right:0,position:'absolute',marginTop:'2px',width:'50px'}}>
                  <img src='https://i.postimg.cc/kgycXQtJ/icons8-search-100.png' width={25} style={{maxWidth:'25'}} ></img>
                </button>
              </div>
              
              {showFilterBox && 
                <div className='filters' ref={filterBoxRef}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1 style={{fontWeight:'500',fontSize:'1.6rem'}}>Filters </h1>
                    {filterCount >0 && <button style={{color:'red',fontSize:'1rem'}} onClick={clearFilters}>Clear Filters</button>}
                  </div>
                  <div style={{marginTop:'-20px'}}>
                  <div onClick={handleDivClick}>
                    <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>
                      Region
                      {expandedFilter === "region" && uniqueRegions.map(region => (
                        <div key={region}>

                            <RedCheckbox
                                name="region"
                                checked={filters.region.includes(region)}
                                onChange={(e) => handleFilterChange(e, region)}
                              />
                          <label>{region}</label>
                        </div>
                      ))}
                  </div>
                  
                  <div onClick={handleDivClickType} style={{maxHeight: '200px', overflowY: 'auto'}}>
                      <span className={expandedFilter === "type" ? "arrow down" : "arrow right"}></span>
                      Type
                      {expandedFilter === "type" && (
                        <>
                          {uniqueTypes.slice(0, showAllFilters ? uniqueTypes.length : 3).map(type => (
                            <div key={type}>
                              <RedCheckbox
                                name="type"
                                checked={filters.type.includes(type)}
                                onChange={(e) => handleFilterChange(e, type)}
                              />
                              <label>{type}</label>
                            </div>
                          ))}
                          {uniqueTypes.length > 3 && (
                            <button
                              style={{color:'red',fontSize:'0.9rem'}}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
                                setShowAllFilters(!showAllFilters);
                              }}
                            >
                              {showAllFilters ? "View Less" : "View More"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
              {/* <div onClick={() => setExpandedFilter(expandedFilter === "type" ? "" : "type")}>
              <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>
                Type
                {expandedFilter === "type" && uniqueTypes.map(type => (
                  <div key={type}>
                    <input type="checkbox" checked={type === type} onChange={() => setType(type)} />
                    <label>{type}</label>
                  </div>
                ))}
              </div> */}

                <div onClick={handleDivClickMonde}>
                    <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>

                    Monde rural
                      {expandedFilter === "Monderural" && uniqueMonderurals.map(monderural => (
                        <div key={monderural}>
                          <RedCheckbox
                              // type="checkbox"
                              name="Monderural"  // Add this line
                              checked={filters.Monderural.includes(monderural)}
                              onChange={(e) => handleFilterChange(e, monderural)}
                            />
                          <label>{monderural}</label>
                        </div>
                      ))}
                  </div>
          
              {/* <div onClick={() => setExpandedFilter(expandedFilter === "Monderural" ? "" : "Monderural")}>
              <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>
                Monde rural
                {expandedFilter === "Monderural" && uniqueMonderurals.map(monderural => (
                  <div key={monderural}>
                    <input type="checkbox" checked={monderural === monderural} onChange={() => setMonderural(monderural)} />
                    <label>{monderural}</label>
                  </div>
                ))}
              </div> */}


                <div onClick={handleDivClickActivit}>
                    <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>
                    Activité
                      {expandedFilter === "Activité" && uniqueActivités.map(activite => (
                        <div key={activite}>
                         <RedCheckbox
                              // type="checkbox"
                              name="Activité"  // Add this line
                              checked={filters.Activité.includes(activite)}
                              onChange={(e) => handleFilterChange(e, activite)}
                            />
                          <label>{activite}</label>
                        </div>
                      ))}
                  </div>
          
              {/* <div onClick={() => setExpandedFilter(expandedFilter === "Activité" ? "" : "Activité")}>
              <span className={expandedFilter === "region" ? "arrow down" : "arrow right"}></span>
                Activité
                {expandedFilter === "Activité" && uniqueActivités.map(activite => (
                  <div key={activite}>
                    <input type="checkbox" checked={activite === activite} onChange={() => setActivite(activite)} />
                    <label>{activite}</label>
                  </div>
                ))}
              </div> */}
          
              
            </div>
                </div>
              }
            </div>
          </nav>
         
    <div className='container' style={{ position: 'relative', zIndex: 0 }}>
      <MapContainer className="lower-z-index" key={isPaneOpen ? "open-state": "closed-state"} center={[50.4995, 4.4754]} zoom={5} style={{ 
      width: isPaneOpen ? 'calc(100vw - 130vh)' : '100vw', 
      height: '100vh' 
    }}>

      <TileLayer
          url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=PRjNGSEFreZIQnED5MQhvjyo2rCWBleGmAy2gHgL6cx2zlJl0TjXop6o4fAk0Gfh"
          attribution='&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a> contributors'
          minZoom={0}
          maxZoom={22}
          subdomains="abcd"
          accessToken="PRjNGSEFreZIQnED5MQhvjyo2rCWBleGmAy2gHgL6cx2zlJl0TjXop6o4fAk0Gfh"
        />
       <MarkerClusterGroup
  chunkedLoading
  iconCreateFunction={(cluster) => {
    return L.divIcon({ 
      html: '<b>' + cluster.getChildCount() + '</b>',
      className: 'my-cluster-icon', 
      iconSize: L.point(30, 30) 
    });
  }}
>
  {filteredData
    .filter((poi) => poi.latLng && poi.latLng.lat !== undefined && poi.latLng.lng !== undefined)
    .map((poi) => (
      <Marker
        key={poi.latLng.id}
        position={[poi.latLng.lat, poi.latLng.lng]}
        icon={customIcon}
        eventHandlers={{ click: () => handleMarkerClick(poi.fields,poi.latLng) }}
      ></Marker>
  ))}
</MarkerClusterGroup>
      </MapContainer>
      <SlidingPane
      className="custom-sliding-pane"
      isOpen={isPaneOpen}
      from="right"
      width="130vh"
      onRequestClose={() => {
        setIsPaneOpen(false);
        setNav(true);
      }}
      hideHeader
    >
      {selectedPoi && <DetailsWindow poi={selectedPoi} coordinates={loco} />}
    </SlidingPane>
    </div>
          </>
      )}

    </div>
  );
};

export default App;
