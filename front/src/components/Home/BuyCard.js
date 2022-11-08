import React from 'react';
import { Typography, Card, CardContent ,CardMedia } from '@mui/material';

// Simple card to display the landing page's two cards
export default function BuyCard(props) {

  return (

      <Card style={{ maxWidth: 645,
        background: 'rgba(0, 0, 0, 0.48)',
        margin: '20px', }}>
          <CardMedia
            style={{height: 440 }}
            component="img"
            src={props.kind.imageUrl}
      />

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h1"
            style= {{fontFamily: 'Futura', fontWeight: 'bold',
            fontSize: '2rem', color: '#fff',}}
          >
            {props.kind.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{ fontFamily: 'Futura',
            fontSize: '1.1rem',
            color: '#ddd', }}
          >
            {props.kind.description}
          </Typography>
        </CardContent>

      </Card>
      
  );

}
