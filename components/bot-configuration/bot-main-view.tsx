import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button, buttonVariants } from "@/components/ui/button"
import { SimpleView, AdvancedView, ExpertView } from "./bot-views"
import { BotActivationWizard } from "./activation"
import type { Bot as ClientBot } from "@/types/bot"
type MaybeBot = Partial<ClientBot> & Record<string, any>;

export function BotMainView({ bot, onAction }: { bot: MaybeBot; onAction: (action: string) => void }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Bot Overview</CardTitle>
            <CardDescription>Monitor and manage your trading bot</CardDescription>
          </div>
          <div className="space-x-2">
            <Button className={buttonVariants({ variant: "outline", size: "sm" })}>
              Simple
            </Button>
            <Button className={buttonVariants({ variant: "outline", size: "sm" })}>
              Advanced
            </Button>
            <Button className={buttonVariants({ variant: "outline", size: "sm" })}>
              Expert
            </Button>
            <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => onAction("edit")}>
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SimpleView bot={bot} />
              <AdvancedView bot={bot} />
              <ExpertView bot={bot} />
            </div>
          </TabsContent>

          <TabsContent value="positions">
            {/* Position management component */}
          </TabsContent>

          <TabsContent value="trades">
            {/* Trade history component */}
          </TabsContent>

          <TabsContent value="settings">
            {/* Bot settings component */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
