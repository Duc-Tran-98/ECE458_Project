import React, { Component } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

const TOP_100_FILMS = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
].map((m, index) => ({ ...m, rank: index + 1 }));

export default class SearchSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: TOP_100_FILMS,
    };
    console.log(TOP_100_FILMS);
  }

  render() {
    const { items } = this.state;
    return (
      <div style={{ width: '200px' }}>

        <Suggest
          inputValueRenderer={(film) => film.title}
          items={items}
          itemPredicate={(query, film, index) => `${index + 1}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0}
          itemRenderer={(film, { handleClick, modifiers }) => (
            <MenuItem
              active={modifiers.active}
              disabled={modifiers.disabled}
              label={film.year.toString()}
              key={film.rank}
              onClick={handleClick}
              text={`${film.rank}. ${film.title}`}
            />
          )}
          noResults={<MenuItem disabled text="No results." />}
          onItemSelect={(film) => {
            alert(`Selected film ${film.title}`);
          }}
          closeOnSelect
          fill
        />
      </div>
    );
  }
}
