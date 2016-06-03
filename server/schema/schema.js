/**
 * Authoring a schema
 *
 */

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';

import Parse from 'parse/node';

const Match = Parse.Object.extend('Match');
const Competition = Parse.Object.extend('Competition');
const MatchAction = Parse.Object.extend('MatchAction');
const Team = Parse.Object.extend('Team');
const Season = Parse.Object.extend('Season');
const config = require('../../conf/run');

var {nodeInterface, nodeField} = nodeDefinitions(
  findObjectByGlobalId,
  objectToGraphQLType
);

function findObjectByGlobalId(globalId) {
  const {type, id} = fromGlobalId(globalId);
  const Ent = ({Match, MatchAction, Team})[type];
  return new Parse.Query(Ent).get(id);
}

function objectToGraphQLType(obj) {
  switch (obj.className) {
    case 'Competition':
      return CompetitionType;
    case 'Match':
      return MatchType;
    case 'MatchAction':
      return MatchActionType;
    case 'Team':
      return TeamType;
    case 'Season':
      return SeasonType;
  }
  return null;
}

var MatchType = new GraphQLObjectType({
  name: 'Match',
  description: 'Football match',
  fields: () => ({
    id: globalIdField('Match'),
    date: { type: GraphQLString },
    time: { type: GraphQLString },
    competition: { type: CompetitionType },
    stage: { type: StageType },
    round: { type: RoundType },
    leg: { type: GraphQLInt },
    liveMatch: { type: BooleanType },
    result: { type: BooleanType },
    previewAvailable: { type: BooleanType },
    reportAvailable: { type: BooleanType },
    lineupsAvailable: { type: BooleanType },
    matchStatus: { type: MatchStatusType },
    attendance: { type: GraphQLString },
    referee: { type: RefereeType },
    venue: { type: VenueType },
    homeTeam: { type: MatchTeamType },
    awayTeam: { type: MatchTeamType }
  }),
  interfaces: [nodeInterface]
});

var BooleanType = new GraphQLEnumType({
  name: 'BooleanType',
  values: {
    No: { value: 0 },
    Yes: { value: 1 }
  }
});

var CompetitionType = new GraphQLObjectType({
  name: 'Competition',
  fields: () => ({
    competitionID: { type: new GraphQLNonNull(GraphQLID) },
    seasonID: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString }
  })
});

var SeasonType = new GraphQLObjectType({
  name: 'Season',
  fields: () => ({
    id: globalIdField('Season'),
    info: { type: GraphQLString }
  })
});

var StageType = new GraphQLObjectType({
  name: 'Stage',
  fields: () => ({
    number: { type: GraphQLInt },
    type: { type: StageTypeType }
  })
});

var StageTypeType = new GraphQLEnumType({
  name: 'StageType',
  values: {
    League: { value: 0 }
  }
});

var RoundType = new GraphQLObjectType({
  name: 'Round',
  fields: () => ({
    number: { type: GraphQLInt },
    text: { type: GraphQLString }
  })
});

var MatchStatusType = new GraphQLEnumType({
  name: 'MatchStatus',
  values: {
    FT: { value: 0 }
  }
});

var RefereeType = new GraphQLObjectType({
  name: 'Referee',
  fields: () => ({
    refereeID: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString }
  })
});

var VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({
    venueID: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString }
  })
});

var MatchTeamType = new GraphQLObjectType({
  name: 'MatchTeam',
  description: 'Info by team in match',
  fields: () => ({
    teamID: { type: new GraphQLNonNull(GraphQLID) },
    teamName: {
      type: GraphQLString,
      resolve: (matchTeam) => new Parse.Query(Team).get(matchTeam.teamID, {
        success: function(team) {
          return team.name;
        },
        error: function(object, error) {
          return '';
        }
      })
    },
    score: { type: GraphQLInt },
    htScore: { type: GraphQLInt }
  })
});

var TeamType = new GraphQLObjectType({
  name: 'Team',
  description: 'Football team',
  fields: () => ({
    id: globalIdField('Team'),
    key: {
      type: GraphQLString,
      resolve: (team) => team.get('key')
    },
    name: {
      type: GraphQLString,
      resolve: (team) => team.get('name')
    },
    badge: {
      type: GraphQLString,
      resolve: (team) => `http://pads6.pa-sport.com/api/football/team/badge/${config.import_key}/${team.key}/200/200`
    }
  }),
  interfaces: [nodeInterface]
});

var MatchActionType = new GraphQLObjectType({
  name: 'MatchAction',
  description: 'Football match details',
  fields: () => ({
    id: globalIdField('MatchAction'),
    teamID: { type: new GraphQLNonNull(GraphQLID) },
    eventID: {type: new GraphQLNonNull(GraphQLID) },
    eventType: { type: GraphQLString },
    matchTime: { type: GraphQLString },
    eventTime: { type: GraphQLString },
    normalTime: { type: GraphQLString },
    addedTime: { type: GraphQLString }
  }),
  interfaces: [nodeInterface]
});

var AppQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    schedule: {
      type: new GraphQLList(MatchType),
      description: 'Match schedule',
      resolve: () => new Parse.Query(Match).find()
      //resolve: () => new Parse.Query(Match).greaterThan('startTime', new Date().getTime()).ascending('startTime').find()
    }
  })
});

export var Schema = new GraphQLSchema({
  query: AppQueryType
});
