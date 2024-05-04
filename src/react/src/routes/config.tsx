import { Checkbox, Input } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ConfigSchema } from "../types/ftpSchema";

export const Route = createFileRoute("/config")({
  component: Config,
});

function Config() {
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remoteDirectory, setRemoteDirectory] = useState("");
  const [usingKeyFile, setUsingKeyFile] = useState(false);
  const [localDirectory, setLocalDirectory] = useState("");
  const [remotePathToScanScript, setRemotePathToScanScript] = useState("");
  const [autoQueue, setAutoQueue] = useState(false);
  const [restrictToPatterns, setRestrictToPatterns] = useState(false);
  const [autoExtract, setAutoExtract] = useState(false);
  const [useLocalPathAsExtractPath, setUseLocalPathAsExtractPath] =
    useState(false);
  const [extractPath, setExtractPath] = useState("");
  const [maxParallelDownloads, setMaxParallelDownloads] = useState(0);
  const [maxTotalConnections, setMaxTotalConnections] = useState(0);
  const [maxConnectionsPerFileSingle, setMaxConnectionsPerFileSingle] =
    useState(0);
  const [maxConnectionsPerFileDirectory, setMaxConnectionsPerFileDirectory] =
    useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const data = await fetch(
        `http://${import.meta.env.VITE_SeedSync_IP}/server/config/get`
      );
      const json = await data.json();
      const isVaild = ConfigSchema.safeParse(json);
      if (isVaild.success) {
        return isVaild.data;
      }
      return null;
    },
  });

  useEffect(() => {
    if (data) {
      setHostname(data.lftp.remote_address);
      setPort(data.lftp.remote_port.toString());
      setUsername(data.lftp.remote_username);
      setPassword(data.lftp.remote_password);
      setUsingKeyFile(data.lftp.use_ssh_key);
      setRemoteDirectory(data.lftp.remote_path);
      setLocalDirectory(data.lftp.local_path);
      setRemotePathToScanScript(data.lftp.remote_path_to_scan_script);
      setAutoQueue(data.autoqueue.enabled);
      setRestrictToPatterns(data.autoqueue.patterns_only);
      setUseLocalPathAsExtractPath(
        data.controller.use_local_path_as_extract_path
      );
      setExtractPath(data.controller.extract_path);
      setAutoExtract(data.autoqueue.auto_extract);
      setMaxParallelDownloads(data.lftp.num_max_parallel_downloads);
      setMaxTotalConnections(data.lftp.num_max_total_connections);
      setMaxConnectionsPerFileSingle(
        data.lftp.num_max_connections_per_dir_file
      );
      setMaxConnectionsPerFileDirectory(
        data.lftp.num_max_connections_per_root_file
      );
    }
  }, [data]);

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);

  const isServerValid = () => {
    if (!hostname) {
      return true;
    }

    const ip = z.string().ip().safeParse(hostname);
    const isValidHostname = z
      .string()
      .regex(
        /^(?:(?:(?:(?:[a-zA-Z0-9][-a-zA-Z0-9]*)?[a-zA-Z0-9])[.])*(?:[a-zA-Z][-a-zA-Z0-9]*[a-zA-Z0-9]|[a-zA-Z])[.]?)$/
      )
      .safeParse(hostname);

    if (ip.success || isValidHostname.success) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="p-3">
        <div className="bg-[#18181b] p-2 m-3">
          <h3> Config </h3>
          <p>
            This is the config page. It is a static page that is not connected
            to the server.
          </p>
          <div className="p-4">
            <Input
              size="md"
              type="text"
              label="Server Hostname"
              placeholder="example.com"
              isRequired={true}
              errorMessage="Please enter a valid hostname"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              isInvalid={isServerValid()} // Call the isServerValid function and pass its result
            />

            <Input
              size="md"
              type="text"
              label="Username"
              placeholder="username"
              isRequired={true}
              errorMessage="Please enter a valid username"
              isInvalid={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              size="md"
              type="password"
              label="Password"
              placeholder="password"
              isRequired={true}
              errorMessage="Please enter a valid password"
              isInvalid={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Checkbox
              onChange={(e) => {
                setUsingKeyFile(e.target.checked);
              }}
              checked={usingKeyFile}
            >
              Using a Key File
            </Checkbox>
            <Input
              className="pt-2"
              size="md"
              type="text"
              label="Remote Directory"
              placeholder="/home/user"
              isRequired={true}
              errorMessage="Please enter a valid remote directory"
              isInvalid={false}
              value={remoteDirectory}
              onChange={(e) => setRemoteDirectory(e.target.value)}
            />
            <Input
              className=""
              size="md"
              type="text"
              label="Local Directory"
              placeholder="/home/user/foo"
              isRequired={true}
              errorMessage="Please enter a valid local directory"
              isInvalid={false}
              value={localDirectory}
              onChange={(e) => setLocalDirectory(e.target.value)}
            />

            <Input
              size="md"
              type="text"
              label="Server ssh Port"
              placeholder="22"
              isRequired={true}
              errorMessage="Please enter a valid port"
              isInvalid={false}
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
            <Input
              className=""
              size="md"
              type="text"
              label="Remote Path to Scan Script"
              placeholder="/home/user/scan.sh"
              isRequired={true}
              errorMessage="Please enter a valid remote path to scan script"
              isInvalid={false}
              value={remotePathToScanScript}
              onChange={(e) => setRemotePathToScanScript(e.target.value)}
            />
          </div>
          <div className="bg-[#18181b] p-2 m-3">
            <h3> Auto Queue </h3>
            <p>
              This is the auto queue section. It is a static page that is not
              connected to the server.
            </p>
            <div className="flex flex-col">
              <Checkbox
                checked={autoQueue}
                onChange={(e) => setAutoQueue(e.target.checked)}
              >
                Enabled AutoQueue (Don't ask WTH this does)
              </Checkbox>
              <Checkbox
                checked={restrictToPatterns}
                onChange={(e) => setRestrictToPatterns(e.target.checked)}
              >
                Restrict to patterns
              </Checkbox>
              <Checkbox
                checked={autoExtract}
                onChange={(e) => setAutoExtract(e.target.checked)}
              >
                Auto Extract
              </Checkbox>
            </div>
          </div>
          <div>
            <h3> Archive Extraction </h3>
            <Checkbox
              checked={useLocalPathAsExtractPath}
              onChange={(e) => setUseLocalPathAsExtractPath(e.target.checked)}
            >
              Use Local Path as Extract Path
            </Checkbox>
            <Input
              onChange={(e) => setExtractPath(e.target.value)}
              value={extractPath}
              size="md"
              type="text"
              label="Extract Path"
              placeholder="/home/user/extract"
              isRequired={true}
              errorMessage="Please enter a valid extract path"
              isInvalid={false}
            />
          </div>
          <div>
            <h3> Connections </h3>
            <Input
              value={maxParallelDownloads.toString()}
              onChange={(e) => setMaxParallelDownloads(Number(e.target.value))}
              size="md"
              type="text"
              label="Max Parallel Downloads"
              placeholder="5"
              isRequired={true}
              errorMessage="Please enter a valid number"
              isInvalid={false}
            />
            <Input
              value={maxTotalConnections.toString()}
              onChange={(e) => setMaxTotalConnections(Number(e.target.value))}
              size="md"
              type="text"
              label="Max Total Connections"
              placeholder="5"
              isRequired={true}
              errorMessage="Please enter a valid number"
              isInvalid={false}
            />

            <Input
              value={maxConnectionsPerFileSingle.toString()}
              onChange={(e) =>
                setMaxConnectionsPerFileSingle(Number(e.target.value))
              }
              size="md"
              type="text"
              label="Max Connections Per File (single file)"
              placeholder="5"
              isRequired={true}
              errorMessage="Please enter a valid number"
              isInvalid={false}
            />

            <Input
              value={maxConnectionsPerFileDirectory.toString()}
              onChange={(e) =>
                setMaxConnectionsPerFileDirectory(Number(e.target.value))
              }
              size="md"
              type="text"
              label="Max Connections Per File (Dirextory)"
              placeholder="5"
              isRequired={true}
              errorMessage="Please enter a valid number"
              isInvalid={false}
            />
            <Input
              size="md"
              type="text"
              label="Max Connections Parallel Files (Dirextory)"
              placeholder="5"
              isRequired={true}
              errorMessage="Please enter a valid number"
              isInvalid={false}
            />
            <Checkbox checked={false}>
              Rename unfinished/downloading files{" "}
            </Checkbox>
          </div>
        </div>
      </div>
    </>
  );
}
