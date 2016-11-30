import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import Sidebar from './Sidebar'
import styles from './styles.module.css'

describe('<Sidebar />', () => {
  let sidebar
  beforeEach(() => {
    sidebar = shallow(<Sidebar />)
  })

  it('contains div with sidebar class', () => {
    expect(sidebar.find(`.${styles.sidebar}`))
      .to.be.defined;
  })
})
