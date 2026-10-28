import { plan } from '@/lib/episodes/plan';
import type { Episode } from '@/lib/storyline';

// Module 3, Data and model requirements: its episodes (FS-0010). An episode with a deck has its
// opening lines (`promise`) and closing card (`takeaway`) written here once; the deck and the post
// read them. The script in the wiki (episodes/03-data/<nn>-<slug>.slides.md) opens with them and copies the card.

const titles = [
  'Intro',
  'Data requirements',
  'Labels',
  'Data quality and leakage',
  'Splits and validation',
  'Choosing metrics',
  'Thresholds and operating points',
  'Baselines',
  'Non-functional requirements',
  'From prototype to production',
  'Feedback loops',
  'People and roles',
  'What it costs',
];

const written: Record<string, Partial<Episode>> = {
  '3.0': {
    promise: [
      'why the model is the small part of an AI product',
      'the three mental models this module is built on',
      'Werkmora and the forecast we follow through the module',
    ],
    takeaway: {
      idea: 'The model is a small box in a large diagram. Most requirements for an AI product are requirements for the system around it.',
      move: 'Treat the data as the specification, give the decision to a business owner, and write monitoring and retraining down before launch.',
      monday: 'Draw the boxes around the model you work on, and write an owner next to each one.',
    },
    deck: '3-0',
  },
  '3.1': {
    promise: [
      'why a row count does not answer “enough data?”',
      'six questions to ask of every data source',
      'how to measure “enough”, per group',
    ],
    takeaway: {
      idea: 'Enough data is six answers per source and a learning curve per group. A row count answers none of them.',
      move: 'Ask the six questions of every source, give each answer an owner, and plot error against data size for each group.',
      monday: 'List the sources of the model you work on, and write the six answers for one of them.',
    },
    deck: '3-1',
  },
  '3.2': {
    promise: [
      'the five places labels come from, and the weakness of each',
      'how to check labels before you trust them',
      'how to plan for labels that arrive late, or only for some cases',
    ],
    takeaway: {
      idea: 'A label is a design decision. The outcome already in the database is cheap, but it can measure the wrong thing, and past decisions shape which cases it covers.',
      move: 'Write each label down with its meaning, its owner and when it arrives; measure agreement and keep a small agreed reference before you trust it.',
      monday: 'Write down the label of the model you work on: what it measures, who decides what it means, and which cases never get one.',
    },
    deck: '3-2',
  },
  '3.3': {
    promise: [
      'why great offline numbers are a reason to check',
      'one rule: only data that existed at prediction time',
      'how to agree the data with the teams that make it',
    ],
    takeaway: {
      idea: 'Great offline numbers are a reason to check. Leakage and skew make a model look better in training than it will be in production.',
      move: 'Use only data that existed at prediction time, one feature code for training and serving, and a contract with each team that produces the data.',
      monday: 'Take the features of the model you work on and write next to each one when its value becomes final.',
    },
    deck: '3-3',
  },
  '3.4': {
    promise: [
      'what a split is for: a copy of production',
      'how to choose between a random, a time and a group split',
      'why the test set is spent once',
    ],
    takeaway: {
      idea: 'A split is a simulation of production. Make new in the test what will be new in production, and read the test set once.',
      move: 'Split by time for a forecast and by group for customers, stores or sites. Tune on a backtest, keep one period sealed, and name who may open it.',
      monday: 'Find out how the model you work on was split, and write one line: what will be new to it in production.',
    },
    deck: '3-4',
  },
  '3.5': {
    promise: [
      'why one number for the whole model is not enough',
      'how to pick the metric from the decision and its cost',
      'three levels of metric, per slice, each with an owner',
    ],
    takeaway: {
      idea: 'A metric decides which errors the team sees. One number for the whole model hides the costly ones.',
      move: 'Pick the metric from the decision and the cost of each error, report it per slice, and write down business, model and guardrail metrics, each with an owner.',
      monday: 'Take the one number your model is judged on, and write next to it the business metric it should move.',
    },
    deck: '3-5',
  },
  '3.6': {
    promise: [
      'why the most precise threshold can cost the most',
      'how the cost of each error sets the operating point',
      'two thresholds, with a person in the middle',
    ],
    takeaway: {
      idea: 'The model gives a score. The costs of its errors pick the threshold, and the most precise one can be the expensive one.',
      move: 'Write down what each error costs, turn it into an operating point with a business owner, and give the human band a price and a capacity.',
      monday: 'Find where the threshold of a model you work on is set, and ask who chose it and from which costs.',
    },
    deck: '3-6',
  },
  '3.7': {
    promise: [
      'why a model score on its own tells you nothing',
      'the three baselines every model stands next to',
      'when to ship the heuristic',
    ],
    takeaway: {
      idea: 'A model score means nothing alone. Next to three baselines on the same data, it shows if the model finds signal, if ML is needed, and if it beats today.',
      move: 'Measure the model against a trivial baseline, a simple heuristic and today’s process, on one test. If it does not clearly beat the heuristic, ship the heuristic.',
      monday: 'Take the last model score you saw, and ask which baseline it was compared with, on which data.',
    },
    deck: '3-7',
  },
  '3.8': {
    promise: [
      'the nine non-functional requirements of a model',
      'how they change in a nightly batch',
      'a fallback for when the model is down or unsure',
    ],
    takeaway: {
      idea: 'A model is a service. Speed, cost, data boundaries, reasons, retraining and a fallback are requirements, each with a number and an owner.',
      move: 'Write the nine on one page before the build, with one fallback for “down” and one for “unsure”, and test the bad nights before go-live.',
      monday: 'For the model you work on, write down what happens tomorrow morning if it does not run tonight.',
    },
    deck: '3-8',
  },
  '3.9': {
    promise: [
      'the three stages and the question each one answers',
      'what production adds around the model',
      'rollout, monitoring, and what to write down first',
    ],
    takeaway: {
      idea: 'A good offline score answers only the first of three questions. Production is the system around the model: pipelines, a registry, a rollout in steps and monitoring with an owner.',
      move: 'Roll out in steps, keep today’s process as a practised fallback, and write the retraining and rollback triggers down before go-live.',
      monday: 'In a system you know, find out which model version made last night’s output, and how you would go back to the one before.',
    },
    deck: '3-9',
  },
  '3.10': {
    promise: [
      'how a model changes the data it later learns from',
      'exploration, a decision log and a control group',
      'why outcomes are captured from the first day',
    ],
    takeaway: {
      idea: 'A deployed model shapes the data it learns from next. An empty shelf records low sales, and the next model learns them as low demand.',
      move: 'Draw the loop, log every decision with its model version and reason, keep a control slice the model does not touch, and capture outcomes from the first day.',
      monday: 'Pick one model you run and check whether its logs tell you what it said, what was done and what happened.',
    },
    deck: '3-10',
  },
  '3.11': {
    promise: [
      'the seven roles of an AI project as seven decisions',
      'the roles most lists leave out',
      'who has the power to stop a model',
    ],
    takeaway: {
      idea: 'A role is a decision with a name next to it. What goes missing is the domain expert at the start, the integrator, the front line and the power to stop.',
      move: 'For every decision, from the problem to the switch, name one person, and bring the domain experts in before the first model.',
      monday: 'For the model you work on, write down who owns it, who sets the threshold and who may switch it off.',
    },
    deck: '3-11',
  },
  '3.12': {
    promise: [
      'the cost lines of an AI product, beyond the cloud bill',
      'which line is the biggest for a small model and a big one',
      'the line most budgets leave out: the cost of being wrong',
    ],
    takeaway: {
      idea: 'The model is the cheap part. Data and labelling, experiments, people and maintenance cost more, and the cost of being wrong is often larger than all of them.',
      move: 'Write every cost line with its driver, its owner and what makes it grow. Budget all the runs around the final model, and put the debt in the plan as work.',
      monday: 'For the model you work on, list the cost lines on one page and put an owner next to each.',
    },
    deck: '3-12',
  },
};

export const module3Episodes: Episode[] = plan(3, 'data', titles).map((e) => ({ ...e, ...written[e.number] }));
