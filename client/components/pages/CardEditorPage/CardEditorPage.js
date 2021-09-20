import React from 'react';

import LeftPane from '_organisms/LeftPane';
import Card from '_molecules/Card';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Columns from 'react-bulma-companion/lib/Columns';
import Column from 'react-bulma-companion/lib/Column';

import { findLastIndex } from 'ramda';

export default function CardEditorPage({location}){
    console.log(location)

    const example_group_arr = [
      {
        id : 1,
        name : '인사과',
        anthing : 'else is possible'
      },
      {
        id : 2,
        name : '00대대'
      },
      {
        id : 3,
        name : '창업동아리'
      }
    ]

    return(
      <Section>
        <Container>
          <Columns>
            <Column>
              <LeftPane 
                name = '홍길동'
                rank = '하사'
                title = '인사담당관'
                groups_arr = {example_group_arr}
                />
            </Column>
            <Column>
              <Card/>
            </Column>
          </Columns>
        </Container>
      </Section>
    )
}
