import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import axios from 'axios';
import {useEffect, useState} from 'react';

export default function Categories(props) {

    const [categories, setCategories] = useState([]);

    const selectCat = (category) =>{
      props.setSelectedCategory(category);
    }

    useEffect(()=>{

      axios.get("https://localhost:33123/categories").then((res)=>{
          setCategories(res.data);

          // Ιnitialise the selection for categories
          props.setSelectedCategory(res.data[0]);
      });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const buildChildren = (cats, parent) =>{
      
        var categs = [];
    
        for (var i=0; i<cats.length;i++){
            if (cats[i].CategoryId===parent.id){
            categs.push(cats[i]);
            }
        }  
    
        const amIaParent = (categories, value) => {
        var ok = false;
        for (var j=0; j<categories.length;j++){
            if (categories[j].CategoryId===value.id){
            ok = true;
            }
            }
            return ok;
        }
    
        return ( 
          <TreeView
            key={parent.name}
            aria-label="controlled"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem key={parent.name} nodeId={parent.name} label={parent.name} onClick={() => selectCat(parent)} >
            { categs.map((value, key)=>{ 
                if (amIaParent(cats, value)){
                    return buildChildren(cats, value);
                }
                else{
                  return ( 
                    <TreeItem key={key} nodeId={value.name} label={value.name} onClick={() => selectCat(value)} />
                  );
                }
            })}
            </TreeItem>
  
          </TreeView>
      );
  
  };



  return (
    <div >

        {categories.length>0 &&
            buildChildren(categories, categories[0])}

    </div>
  );
}
