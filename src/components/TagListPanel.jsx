import '../scss/main.scss';
import React from 'react';
import Checkbox from './Checkbox.jsx';

class TagListPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      treeComponents: []
    }
    this.treeComponents = [];
    this.newTagFilters = [];
  }

  componentDidMount() {
    this.computeTree(this.props.tags.children[this.props.tagType]);
  }

  componentWillReceiveProps(nextProps) {
    this.computeTree(nextProps.tags.children[nextProps.tagType]);
  }

  traverseNodeAndCheckIt(node, depth, active) {
    // do something to node
    const tagFilter = this.newTagFilters.find(tagFilter => tagFilter.key === node.key)
    tagFilter.active = (depth === 0) ? !node.active : active;
    tagFilter.depth = depth;
    depth = depth + 1;

    if (Object.keys(tagFilter.children).length > 0) {
      Object.values(tagFilter.children).forEach((childNode) => {
        this.traverseNodeAndCheckIt(childNode, depth, tagFilters, tagFilter.active);
      });
    }
  }

  onClickCheckbox(tag) {
    this.newTagFilters = this.props.tagFilters.slice(0);
    let depth = 0;
    if (tag.key && tag.children) this.traverseNodeAndCheckIt(tag, depth);

    this.props.filter({ tags: this.newTagFilters });
  }

  createNodeComponent (node, depth) {
    return (
      <li
        key={node.key.replace(/ /g,"_")}
        className={'tag-filter active'}
        style={{ marginLeft: `${depth*20}px` }}
      >
          <Checkbox
            label={node.key}
            isActive={node.active}
            onClickCheckbox={() => this.onClickCheckbox(node)}
          />
      </li>
    );
  }

  traverseNodeAndCreateComponent(node, depth) {
    // add and create node component
    const newComponent = this.createNodeComponent(node, depth);
    this.treeComponents.push(newComponent)
    depth = depth + 1;
    if (Object.keys(node.children).length > 0) {
      Object.values(node.children).forEach((childNode) => {
        this.traverseNodeAndCreateComponent(childNode, depth);
      });
    }
  }

  computeTree (node) {
    this.treeComponents = [];
    let depth = 0;
    this.traverseNodeAndCreateComponent(node, depth);
    this.setState({ treeComponents: this.treeComponents });
  }

  renderTree() {
    return this.state.treeComponents.map(c => c);
  }

  render() {
    return (
      <div className="react-innertabpanel">
        {this.renderTree()}
      </div>
    );
  }
}

export default TagListPanel;
