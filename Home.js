import React from 'react';
import * as TokenUtil from './util/TokenUtil.js';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        TokenUtil.redirectWhenNotExistToken(TokenUtil.getToken());
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}
