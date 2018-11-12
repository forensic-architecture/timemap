import '../scss/main.scss';
import React from 'react';
import View2D from './View2D.jsx';

class Viewport extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if( this.props.isView2d ) {
      return (
        <View2D
          locations={this.props.locations}
          narratives={this.props.narratives}
          sites={this.props.sites}
          categoryGroups={this.props.categoryGroups}

          views={this.props.views}
          selected={this.props.selected}
          highlighted={this.props.highlighted}
          mapAnchor={this.props.mapAnchor}

          uiStyle={this.props.uiStyle}
          dom={this.props.dom}

          select={this.props.select}
          highlight={this.props.highlight}
          getCategoryGroupColor={category => this.props.getCategoryGroupColor(category)}
          getCategoryGroup={category => this.props.getCategoryGroup(category)}
        />
      );
    }
  }
}

export default Viewport;
