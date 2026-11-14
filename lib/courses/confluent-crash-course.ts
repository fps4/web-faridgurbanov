import type { Series } from '@/lib/learning';

// The Confluent crash course (FS-0012): one episode per module of the public repo, plus an intro.
// The episodes explain why the labs are built the way they are; the scripts are in the wiki
// (publishing/confluent-crash-course/episodes/). Episode numbers follow the repo's suggested order,
// so they differ from the repo's module folder numbers (episode 1 is module 08).
export const confluentCrashCourse: Series = {
  slug: 'confluent-crash-course',
  title: 'Confluent crash course',
  line: 'Confluent Platform in your own data centres and Confluent Cloud on Azure: linking, private networking, governance, encryption and access, with a lab for every module.',
  repo: 'https://github.com/fps4/confluent-crash-course',
  episodes: [
    {
      number: '0',
      slug: 'why-this-course',
      title: 'Why this course',
      line: 'The situation the course is built around, who it is for, and how a module works.',
      video: {
        youtubeId: 'ci4eOUho0mM',
        duration: '3:07',
        poster: '/media/learning/confluent-0.jpg',
        uploaded: '2026-11-13',
      },
      promise: [
        'The situation: Kafka that runs operations in your own data centres, and data and AI teams in Azure who want the same events.',
        'Who the course is for, and what you need before you start.',
        'How a module works: notes, a lab you run yourself, and a video on the reasoning.',
      ],
    },
    {
      number: '1',
      slug: 'getting-data-out',
      title: 'Getting data out of the data centre',
      line: 'One outbound link to Confluent Cloud, schemas that keep their IDs, and what broker validation checks.',
      repoModule: '08-linking-and-contracts',
      promise: [
        'How one outbound connection carries a full copy of a topic to Confluent Cloud.',
        'Why that copy is useless if the schemas don’t travel with it.',
        'What broker-side schema validation checks, which is less than most people think.',
      ],
      questions: [
        'Which cloud cluster type is the destination, and how does the data centre reach it?',
        'Does the on-prem licence include Confluent Server and Cluster Linking?',
        'Which topics are on the allow-list, and who approves a new one?',
        'Which registry is the write master for each subject?',
        'What is the firewall idle timeout on the outbound flow?',
      ],
    },
    {
      number: '2',
      slug: 'copies-and-failover',
      title: 'Copies, failover and the way back',
      line: 'Byte copies and record copies, what an analytics copy promises, and why failback is decided on day one.',
      repoModule: '01-hybrid-multicloud',
      promise: [
        'How the three tools for copying Kafka data differ, and how to pick one.',
        'Why a copy for analytics and a copy for disaster recovery make different promises.',
        'Why the way back has to be decided on the day you build the link.',
      ],
      questions: [
        'What is the round-trip time between the data centres, and is there a third site?',
        'Which topics may leave the data centre, and who decides?',
        'Do the on-prem brokers run Confluent Server, or plain Apache Kafka?',
        'Is the cloud copy only for analytics, or could it ever become a recovery site?',
      ],
    },
    {
      number: '3',
      slug: 'kafka-on-azure-networks',
      title: 'Kafka doesn’t fit through a load balancer',
      line: 'Why Kafka networking is different, Private Link on Azure, and the DNS that makes it work.',
      repoModule: '02-cloud-networking-azure',
      promise: [
        'Why a Kafka client must reach every broker, so a load balancer or an API gateway can’t sit in the path.',
        'Which private networking options you have on Azure, and which one fits a data centre.',
        'How DNS has to work, from the cloud and from the data centre.',
      ],
      questions: [
        'Is there already a hub with an ExpressRoute gateway, a firewall and a DNS resolver?',
        'How do on-prem DNS servers resolve Azure private endpoints today?',
        'What idle timeout do the firewalls apply to long-lived connections?',
        'Are production and non-production separate Confluent environments?',
      ],
    },
    {
      number: '4',
      slug: 'stream-governance',
      title: 'Governance for teams that don’t know each other',
      line: 'No schema, no topic; Git as the source of truth; a catalog the cloud teams use.',
      repoModule: '03-stream-governance',
    },
    {
      number: '5',
      slug: 'field-level-encryption',
      title: 'Encrypting a field nobody else should read',
      line: 'Minimise first, then encrypt: who holds the key, and what Databricks sees.',
      repoModule: '04-csfle',
    },
    {
      number: '6',
      slug: 'security-and-access',
      title: 'Who is allowed to read this',
      line: 'Entra ID in place of shared API keys, one role per access pattern, quotas and audit.',
      repoModule: '05-cloud-security',
    },
    {
      number: '7',
      slug: 'production-platform',
      title: 'From “it works” to “it runs a business”',
      line: 'The accidental shared service, clusters split by SLA, lag in seconds, and chargeback.',
      repoModule: '06-production-systems',
    },
    {
      number: '8',
      slug: 'kafka-internals',
      title: 'One layer down',
      line: 'The Kafka internals behind these decisions: acks, in-sync replicas, and the third site.',
      repoModule: '07-kafka-internals',
    },
  ],
};
