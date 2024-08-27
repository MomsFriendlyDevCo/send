@MomsFriendlyDevCo/Send
=======================
Simple notification system with extendable modules.


```javascript
import Send from '#lib/send';
new Send()
    .use('slack', {
        enabled: false,
        // ... Slack config goes below here ... //
        token: 'FIXME',
        channel: 'FIXME',
        username: 'FIXME',
    })
    .use('freedcamp', {
        enabled: false,
        // ... Freedcamp config goes here ... //
        apiKey: 'FIXME',
        secret: 'FIXME',
        projectId: 'FIXME',
        discussionListTitle: 'FIXME',
        discussionListId: 'FIXME',
    })
    .send('Hello World')
```

... or via the cli ...

```shell
send \
    -m slack@token=FIXME,channel=FIXME,username=FIXME \
    -m freedcamp@apiKey=FIXME,secret=FIXME,projectId=FIXME,discussionListTitle=FIXME \
    --text "Hello World"
```
