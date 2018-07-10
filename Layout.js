import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './Menu.js';
import HeaderBody from './HeaderBody';

const Layout = (props) => ({
    render() {
        return (
            <section id="container" class="">
                <HeaderBody/>
                <Menu/>
                {/* <!--main content start--> */}
                <section id="main-content">
                    <section class="wrapper">
                        {this.props.children}
                    </section>
                    <div class="text-right">
                        <div class="credits">
                        </div>
                    </div>
                </section>
            </section>
        )
    }
})

export default Layout;
