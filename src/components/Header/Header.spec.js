import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import Header from './Header'

describe('<Header />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Header />)
  })

  // Will show up as pending
  it('contains a title component with yelp', () => {
    expect(wrapper.find('h1').first().text())
        .to.equal('Yelp')
  })

  it('contains a section menu with the title', () => {
    expect(wrapper.find('section').first().text())
        .to.equal('Tejas reacts!')
  });
})
