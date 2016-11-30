import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import Sidebar from './Sidebar'

describe('<Sidebar />', () => {
  let sidebar
  beforeEach(() => {
    sidebar = shallow(<Sidebar />)
  })

  it('contains div with sidebar class', () => {
  })
})
