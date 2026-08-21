/**
 * FDI-1.1 question set — approved Business Health Check wording.
 *
 * FDI-1.0 remains immutable. These item and response texts are a new version
 * while retaining the same ordered response scale, IDs, and numerical model.
 */

import type { FdiQuestionSet } from '../types';

export const FDI_1_1_QUESTIONS: FdiQuestionSet = Object.freeze({
  questionSetVersion: 'FDI-QS-1.1',
  questions: Object.freeze([
    Object.freeze({
      id: 'DS1', componentKey: 'DS',
      text: 'When an important decision needs to be made, and you are not available, what usually happens?',
      options: Object.freeze([
        Object.freeze({ id: 'DS1-A', score: 0, text: 'The responsible person makes the decision' }),
        Object.freeze({ id: 'DS1-B', score: 1, text: 'Most decisions continue, but some wait for me' }),
        Object.freeze({ id: 'DS1-C', score: 2, text: 'Many important decisions wait until I am available' }),
        Object.freeze({ id: 'DS1-D', score: 3, text: 'Important decisions usually stop until I decide' }),
      ]),
    }),
    Object.freeze({
      id: 'DS2', componentKey: 'DS',
      text: 'How much can your team decide without asking for your approval?',
      options: Object.freeze([
        Object.freeze({ id: 'DS2-A', score: 0, text: 'The team handles regular decisions without me' }),
        Object.freeze({ id: 'DS2-B', score: 1, text: 'Most regular decisions are handled without me' }),
        Object.freeze({ id: 'DS2-C', score: 2, text: 'The team handles smaller decisions, but many still need my approval' }),
        Object.freeze({ id: 'DS2-D', score: 3, text: 'I approve most important decisions' }),
      ]),
    }),
    Object.freeze({
      id: 'DS3', componentKey: 'DS',
      text: 'If work needs your decision, how long does it usually wait?',
      options: Object.freeze([
        Object.freeze({ id: 'DS3-A', score: 0, text: 'It usually does not wait because someone else can decide' }),
        Object.freeze({ id: 'DS3-B', score: 1, text: 'A few hours' }),
        Object.freeze({ id: 'DS3-C', score: 2, text: 'Until later that day or the next working day' }),
        Object.freeze({ id: 'DS3-D', score: 3, text: 'More than one working day or until I am available' }),
      ]),
    }),
    Object.freeze({
      id: 'DS4', componentKey: 'DS',
      text: 'How often does your team ask you to make decisions they could make themselves?',
      options: Object.freeze([
        Object.freeze({ id: 'DS4-A', score: 0, text: 'Rarely' }),
        Object.freeze({ id: 'DS4-B', score: 1, text: 'Sometimes' }),
        Object.freeze({ id: 'DS4-C', score: 2, text: 'Often' }),
        Object.freeze({ id: 'DS4-D', score: 3, text: 'Almost every day' }),
      ]),
    }),
    Object.freeze({
      id: 'EC1', componentKey: 'EC',
      text: 'For important work that happens regularly, how well is the process written down for the team?',
      options: Object.freeze([
        Object.freeze({ id: 'EC1-A', score: 0, text: 'Important processes are written down, easy to find, and used' }),
        Object.freeze({ id: 'EC1-B', score: 1, text: 'Most important processes are written down, with some gaps' }),
        Object.freeze({ id: 'EC1-C', score: 2, text: "Some are written down, but much still depends on people's knowledge" }),
        Object.freeze({ id: 'EC1-D', score: 3, text: 'Most important work depends on what a few key people or I know' }),
      ]),
    }),
    Object.freeze({
      id: 'EC2', componentKey: 'EC',
      text: 'When different team members do the same work, how similar are the results?',
      options: Object.freeze([
        Object.freeze({ id: 'EC2-A', score: 0, text: 'The results consistently meet the same standard' }),
        Object.freeze({ id: 'EC2-B', score: 1, text: 'Results are usually consistent, with some differences' }),
        Object.freeze({ id: 'EC2-C', score: 2, text: 'Quality changes noticeably depending on who does the work' }),
        Object.freeze({ id: 'EC2-D', score: 3, text: 'Good results depend heavily on certain people or my involvement' }),
      ]),
    }),
    Object.freeze({
      id: 'EC3', componentKey: 'EC',
      text: 'How often does completed work need to be corrected or done again?',
      options: Object.freeze([
        Object.freeze({ id: 'EC3-A', score: 0, text: 'Rarely' }),
        Object.freeze({ id: 'EC3-B', score: 1, text: 'Sometimes' }),
        Object.freeze({ id: 'EC3-C', score: 2, text: 'Often' }),
        Object.freeze({ id: 'EC3-D', score: 3, text: 'Rework and correction are a normal part of our work' }),
      ]),
    }),
    Object.freeze({
      id: 'EC4', componentKey: 'EC',
      text: 'When you are not personally supervising the work, what usually happens?',
      options: Object.freeze([
        Object.freeze({ id: 'EC4-A', score: 0, text: 'Quality and speed stay about the same' }),
        Object.freeze({ id: 'EC4-B', score: 1, text: 'Some issues appear, but work generally continues normally' }),
        Object.freeze({ id: 'EC4-C', score: 2, text: 'Quality or speed becomes noticeably worse' }),
        Object.freeze({ id: 'EC4-D', score: 3, text: 'Serious delays or quality problems occur' }),
      ]),
    }),
    Object.freeze({
      id: 'OV1', componentKey: 'OV',
      text: 'Can you see what is happening in the business without asking your team for updates?',
      options: Object.freeze([
        Object.freeze({ id: 'OV1-A', score: 0, text: 'Yes — the information I need is already available' }),
        Object.freeze({ id: 'OV1-B', score: 1, text: 'Mostly — I sometimes need to ask' }),
        Object.freeze({ id: 'OV1-C', score: 2, text: 'Only partly — I regularly need to ask for updates' }),
        Object.freeze({ id: 'OV1-D', score: 3, text: 'No — asking people is the main way I know what is happening' }),
      ]),
    }),
    Object.freeze({
      id: 'OV2', componentKey: 'OV',
      text: 'How up to date is the information you use to manage the business?',
      options: Object.freeze([
        Object.freeze({ id: 'OV2-A', score: 0, text: 'It is up to date when I need it' }),
        Object.freeze({ id: 'OV2-B', score: 1, text: 'It is usually up to date, with some delays' }),
        Object.freeze({ id: 'OV2-C', score: 2, text: 'It is often out of date' }),
        Object.freeze({ id: 'OV2-D', score: 3, text: 'I regularly do not have reliable, current information' }),
      ]),
    }),
    Object.freeze({
      id: 'OV3', componentKey: 'OV',
      text: 'How do you usually find out about an important problem in the business?',
      options: Object.freeze([
        Object.freeze({ id: 'OV3-A', score: 0, text: 'Our reports or systems show the problem early' }),
        Object.freeze({ id: 'OV3-B', score: 1, text: 'The team reports it through the normal process' }),
        Object.freeze({ id: 'OV3-C', score: 2, text: 'Someone tells me after it has already affected the work' }),
        Object.freeze({ id: 'OV3-D', score: 3, text: 'I find out myself, from a customer, or when it becomes urgent' }),
      ]),
    }),
    Object.freeze({
      id: 'OV4', componentKey: 'OV',
      text: 'How often do you have to chase your team for updates, numbers, or explanations?',
      options: Object.freeze([
        Object.freeze({ id: 'OV4-A', score: 0, text: 'Rarely — the information is usually available' }),
        Object.freeze({ id: 'OV4-B', score: 1, text: 'Sometimes' }),
        Object.freeze({ id: 'OV4-C', score: 2, text: 'Often' }),
        Object.freeze({ id: 'OV4-D', score: 3, text: 'Chasing updates is a regular part of my day' }),
      ]),
    }),
  ]),
} satisfies FdiQuestionSet);
