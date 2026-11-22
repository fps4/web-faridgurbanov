---
title: AI multiplies an engineer who guides it
summary: I consider AI as a tool that can multiply our potential as engineers and architects.
date: 2026-11-22
order: 3
read: Three-minute read
from: [My daily work]
---

I consider AI as a tool that can multiply our potential as engineers and architects. But it is very difficult, or impossible, to give it very little context and expect it to build something that would actually work for everyone.

For that to happen we really need to guide AI closely. We create frameworks and proper, curated context, so that it first builds what is needed. Then there is another layer of governance and validation, with human gates. That is actually what I am doing.

One example of curated context is a skill for a platform product, published in a catalog that the whole organization uses. I have created one, and teams find it very useful. Engineers who use AI to generate code are then aware of all the features and intricacies of the product. They spend less time and make less mistakes.

In my daily work I start with brainstorming different potential solutions. I do modeling with different scenarios, and I make sure that all the pros and cons are covered that are important to me as a responsible engineer or architect. The coding itself is usually done by AI, but I review it closely before committing.

I also use it regularly as a review agent. When a team works with AI every day, pull requests become quite long and difficult to review. With 50 different files, a pure human review is not effective anymore. You agree or not, you need a modern tool to make an effective review.

The other aspect is root cause analysis. It is quite effective if you have proper integrations with your monitoring and logging systems. You give AI the ability to correlate events from the repository, from the pipeline, from the logs and from infrastructure changes, for example Terraform plans. I have used it this way on an error that was quite complex to catch. It helped to spot the error and to explain quite precisely where the problem is. A pure human team would need another few hours, which in a large enterprise might mean millions of lost revenue.

I don't remember one time when AI was simply wrong, maybe because I don't expect it to be 100% right. What I did have is AI providing a solution that would not fit the particular use case, for reasons that were not made clear in the beginning.

And in my solutions I rely on deterministic processes and tests rather than on an LLM.
